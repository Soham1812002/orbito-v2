---
name: backend-pattern-executor
description: >-
  Use this skill whenever planning, architecting, implementing, reviewing, or refactoring backend features,
  REST APIs, database migrations, models, services, controllers, or seeders in Orbito v2. Enforces the strict
  5-layer backend pattern, zero-drift PostgreSQL migrations, Sequelize ORM standards, DTO validation, atomic
  transactions, RBAC permissions, and pre-flight build and migration checks.
---

# Orbito v2 Backend Implementation Guide (Backend Pattern Executor)

This guide documents the mandatory architecture, workflow, coding standards, database patterns, and security guardrails established for the **Orbito v2 Backend API** (Node.js 22+, Express 5, TypeScript 5.7, Sequelize 6 ORM, PostgreSQL 16).

> [!IMPORTANT]
> **Mandatory Rule:** Whenever planning, creating, or modifying **ANY backend code**, you **MUST** follow the pre-flight workflow in Section 1, adhere strictly to the 5-layer architecture in Section 2, and verify builds and migrations in Section 9.

---

## 1. Mandatory Pre-Flight Workflow

Before writing any backend code, execute this 4-step sequence:

```mermaid
graph LR
    A["1. Pre-Flight Inspection (Models & Migrations)"] --> B["2. Migration Check (npm run migrate:check)"]
    B --> C["3. Implementation (5-Layer Pattern)"]
    C --> D["4. Verification (Build, Migrate & Curl)"]
```

### Step 1.1: Pre-Flight Inspection
1. Read existing models in [`backend/src/models/`](file:///Users/soham18/Desktop/orbito-v2/backend/src/models/) and routes in [`backend/src/routes/`](file:///Users/soham18/Desktop/orbito-v2/backend/src/routes/).
2. Inspect [`backend/src/utils/constants.ts`](file:///Users/soham18/Desktop/orbito-v2/backend/src/utils/constants.ts) to verify available permissions (`PERMISSIONS.*`) and role codes (`ROLES.*`).
3. Check `backend/src/migrations/runner.ts` to see the current list of applied migrations.

### Step 1.2: Check Zero-Drift Database Status
Always run the database migration check before writing changes:
```bash
cd backend && npm run migrate:check
```
*Requirement:* Must output `Database migration check passed: 0 pending migrations.` before introducing new schema alterations.

---

## 2. The Strict 5-Layer Backend Pattern

Every request in Orbito v2 travels through 5 distinct, decoupled layers. **Never skip or merge layers.**

```text
HTTP Request
     ↓
1. Router        (backend/src/routes/)        → Route path, HTTP verb, middleware binding
     ↓
2. Middlewares   (backend/src/middlewares/)   → JWT auth, RBAC permissions, DTO validation
     ↓
3. Controller    (backend/src/controllers/)   → Extract inputs, call service, format HTTP response
     ↓
4. Service       (backend/src/services/)      → Business logic, ORM queries, transactions
     ↓
5. Model         (backend/src/models/)        → Sequelize table definition, types, indexes
```

### Layer Rules:

| Layer | Folder | Responsibilities | Forbidden (Never Do) |
|---|---|---|---|
| **1. Router** | `src/routes/` | Mount endpoints, apply auth/RBAC/validation middleware chains. | No database queries, no business logic, no `req`/`res` manipulation. |
| **2. Middlewares** | `src/middlewares/` | `authenticate`, `checkPermissions`, `validateDto`, rate limits. | Never bypass authentication or permissions to suppress an error. |
| **3. Controller** | `src/controllers/` | Parse request inputs (`params`, `body`, `query`), call service, return uniform JSON responses. Target <= 250 lines. | No SQL queries, no direct Sequelize model access, no password hashing. |
| **4. Service** | `src/services/` | Business logic, calculations, password hashing (`bcrypt`), transactions (`sequelize.transaction()`), throw typed errors. Target <= 500 lines. | No Express `req` or `res` objects passed into services. Pure TypeScript arguments. |
| **5. Model** | `src/models/` | Table schemas, UUID v4 primary keys, snake_case columns, paranoid soft deletes, table relationships. | No ad-hoc business logic inside model getters/setters. |

---

## 3. Implementation Blueprint by Layer

### Layer 1: Router (`backend/src/routes/`)
Routes must be concise, expressive, and declare middleware guards explicitly:

```typescript
import { Router } from "express";
import { EntityController } from "../controllers/entity.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { checkPermissions } from "../middlewares/rbac.middleware.js";
import { validateDto } from "../middlewares/validation.middleware.js";
import { CreateEntityDto, UpdateEntityDto } from "../dtos/entity.dto.js";
import { PERMISSIONS } from "../utils/constants.js";

const router = Router();

// Protect all sub-routes with JWT authentication
router.use(authenticate);

router.get(
  "/",
  checkPermissions([PERMISSIONS.VIEW_ENTITY]),
  EntityController.list
);

router.get(
  "/:id",
  checkPermissions([PERMISSIONS.VIEW_ENTITY]),
  EntityController.getById
);

router.post(
  "/",
  checkPermissions([PERMISSIONS.MANAGE_ENTITY]),
  validateDto(CreateEntityDto),
  EntityController.create
);

router.put(
  "/:id",
  checkPermissions([PERMISSIONS.MANAGE_ENTITY]),
  validateDto(UpdateEntityDto),
  EntityController.update
);

router.delete(
  "/:id",
  checkPermissions([PERMISSIONS.MANAGE_ENTITY]),
  EntityController.delete
);

export default router;
```

> [!IMPORTANT]
> **Route Precedence Guardrail:** Always register explicit, static, or sub-resource paths (`/stats/summary`, `/item/:id`, `/bulk`) **before** dynamic catch-all route parameters (`/:moduleKey`, `/:id`) in the router. Declaring a generic `:moduleKey` route before a specific subpath will shadow the specific route and misinterpret subpath tokens as dynamic keys.

### Layer 2: Middlewares (`backend/src/middlewares/`)
- **`authenticate`**: Verifies Bearer JWT token from `Authorization` header. Attaches `req.user = { id, email, roles, permissions }`. Rejects missing or expired tokens with `401 Unauthorized`.
- **`checkPermissions([requiredPerms])`**: Checks if user possesses the required permissions or has the `OPERATE:ALL` SuperAdmin bypass. Rejects unauthorized access with `403 Forbidden`.
- **`validateDto(DtoClass)`**: Transforms request body using `class-transformer` and validates against decorators using `class-validator`. Formats validation errors into clean messages and returns `400 Bad Request`.

### Layer 3: Controller (`backend/src/controllers/`)
Controllers must remain thin coordinators. Always wrap in `try/catch` and pass errors to `next(err)`:

```typescript
import { Request, Response, NextFunction } from "express";
import { EntityService } from "../services/entity.service.js";
import { parsePaginationParams } from "../utils/pagination.util.js";

export class EntityController {
  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePaginationParams(req);
      const data = await EntityService.list(pagination);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await EntityService.getById(id);
      res.status(200).json({ result });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await EntityService.create(req.body);
      res.status(201).json({
        message: "Entity created successfully",
        result
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await EntityService.update(id, req.body);
      res.status(200).json({
        message: "Entity updated successfully",
        result
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await EntityService.delete(id);
      res.status(200).json({
        message: "Entity deleted successfully",
        result
      });
    } catch (err) {
      next(err);
    }
  }
}
```

### Layer 4: Service (`backend/src/services/`)
Services contain domain business logic. Multi-table operations must use atomic transactions:

```typescript
import { Op } from "sequelize";
import { Entity } from "../models/entity.model.js";
import { AuditLog } from "../models/audit_log.model.js";
import { sequelize } from "../configs/database.js";
import { PaginationParams, buildPaginatedEnvelope } from "../utils/pagination.util.js";

export class EntityService {
  static async list(params: PaginationParams) {
    const where: any = {};
    if (params.search) {
      where.name = { [Op.iLike]: `%${params.search}%` };
    }

    const { count, rows } = await Entity.findAndCountAll({
      where,
      limit: params.limit,
      offset: (params.page - 1) * params.limit,
      order: [[params.sort || "created_at", params.order || "DESC"]]
    });

    return buildPaginatedEnvelope(rows, count, params.page, params.limit);
  }

  /**
   * JSONB PostgreSQL Query Standard:
   * For polymorphic or dynamic schemas stored in JSONB columns (`data`), never load all rows into Node memory.
   * Perform database-level text casting and pagination directly in PostgreSQL:
   * where[Op.and] = [
   *   sequelize.where(sequelize.cast(sequelize.col("data"), "text"), { [Op.iLike]: `%${params.search}%` })
   * ];
   */

  static async getById(id: string) {
    const item = await Entity.findByPk(id);
    if (!item) {
      const err: any = new Error("Entity not found");
      err.status = 404;
      throw err;
    }
    return item;
  }

  static async create(payload: Record<string, any>, operatorUser?: any) {
    return await sequelize.transaction(async (transaction) => {
      const record = await Entity.create(payload, { transaction });

      // Immutable Audit Log
      await AuditLog.create(
        {
          userName: operatorUser?.name || "System Admin",
          userRole: operatorUser?.role || "ADMIN",
          userInitials: "SA",
          action: "CREATE_ENTITY",
          module: "Entity Module",
          ipAddress: "127.0.0.1",
          status: "SUCCESS",
          details: `Created entity ${record.id}`
        },
        { transaction }
      );

      return record;
    });
  }

  static async delete(id: string) {
    const record = await Entity.findByPk(id);
    if (!record) {
      const err: any = new Error("Entity not found");
      err.status = 404;
      throw err;
    }
    await record.destroy(); // Soft delete if paranoid: true
    return { id };
  }
}
```

### Layer 5: Model (`backend/src/models/`)
Sequelize model definitions with TypeScript strict typing:

```typescript
import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../configs/database.js";

export interface EntityAttributes {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface EntityCreationAttributes
  extends Optional<EntityAttributes, "id" | "isActive" | "createdAt" | "updatedAt" | "deletedAt"> {}

export class Entity extends Model<EntityAttributes, EntityCreationAttributes> implements EntityAttributes {
  declare id: string;
  declare name: string;
  declare code: string;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

Entity.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    code: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active"
    }
  },
  {
    sequelize,
    tableName: "entities",
    timestamps: true,
    paranoid: true, // Soft-delete via deleted_at
    underscored: true // Maps camelCase attributes to snake_case DB columns
  }
);
```

---

## 4. Database Migrations (Zero-Drift Standard)

All database schema modifications must be created as code migrations in [`backend/src/migrations/`](file:///Users/soham18/Desktop/orbito-v2/backend/src/migrations/).

### 4.1 Migration File Anatomy (`XXX_<feature_name>.ts`)
```typescript
import { QueryInterface, DataTypes, Transaction } from "sequelize";

export const name = "00X_feature_name";

export async function up(queryInterface: QueryInterface, transaction: Transaction): Promise<void> {
  await queryInterface.createTable(
    "table_name",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    { transaction }
  );

  await queryInterface.addIndex("table_name", ["name"], { transaction });
  await queryInterface.addIndex("table_name", ["is_active"], { transaction });
}

export async function down(queryInterface: QueryInterface, transaction: Transaction): Promise<void> {
  await queryInterface.dropTable("table_name", { transaction });
}
```

### 4.2 Register in Migration Runner
Open [`backend/src/migrations/runner.ts`](file:///Users/soham18/Desktop/orbito-v2/backend/src/migrations/runner.ts) and add the new migration import to `AVAILABLE_MIGRATIONS`:
```typescript
import * as featureMigration from "./00X_feature_name.js";

const AVAILABLE_MIGRATIONS: MigrationDefinition[] = [
  initialSchema,
  auditAndSystemConfig,
  appConfig,
  featureMigration
];
```

### 4.3 Migration Commands
```bash
# Apply pending migrations
npm run migrate

# Verify 0 pending migrations
npm run migrate:check
```

---

## 5. Dynamic Document Store Pattern (`system_configs` & `app_configs`)

When building extensive configuration modules (e.g. System Config, App Config) with dozens of sub-modules that share dynamic JSON payloads, use the **partitioned document-store pattern**:

```text
Table: app_configs / system_configs
Columns:
  • id: UUID (PK)
  • module_key: VARCHAR(64) [Indexed]
  • data: JSONB NOT NULL
  • is_active: BOOLEAN [Indexed]
  • created_at, updated_at, deleted_at (Paranoid Soft Delete)
```

### Advantages:
1. Eliminates database schema churn and dozens of trivial 3-column tables.
2. Supports dynamic schema evolution via TypeScript registries (`configs.ts`).
3. Supports batch XLSX/CSV bulk uploads using `AppConfig.bulkCreate(records, { transaction })`.
4. High-performance JSONB querying in PostgreSQL 16.

### Summary Metrics Query Pattern:
```typescript
const moduleCounts = await AppConfig.findAll({
  attributes: [
    "moduleKey",
    [sequelize.fn("COUNT", sequelize.col("id")), "count"]
  ],
  group: ["moduleKey"],
  raw: true
});
```

---

## 6. Data Seeding & Zero-Mock Policy

Orbito v2 enforces a strict **Zero-Mock Policy**. Hardcoded mocks in frontend files are forbidden. All initial or demo data must be seeded into PostgreSQL.

### Seeding Rules:
1. Define typed seed dictionaries in [`backend/src/migrations/seedData.ts`](file:///Users/soham18/Desktop/orbito-v2/backend/src/migrations/seedData.ts).
2. Use realistic fleet data (real plate patterns, valid Indian state codes, real telecom carriers, 15-digit IMEIs, 20-digit ICCIDs).
3. In [`backend/src/migrations/seed.ts`](file:///Users/soham18/Desktop/orbito-v2/backend/src/migrations/seed.ts), wrap seed execution in `sequelize.transaction()`.
4. Make seeds idempotent using count guards (`if (count < 10) await Model.create(...)`) or `findOrCreate()`.
5. Link all newly created permissions to standard roles:
   - `SUPER_ADMIN`: bypasses via `OPERATE:ALL`.
   - `ADMIN`: full view & manage permissions.
   - `FLEET_MANAGER` / `BRANCH_OPERATOR`: domain operational permissions.
   - `USER`: read-only view permissions.

Run seed script:
```bash
cd backend && npm run seed
```

---

## 7. Standard API Response Formats

All backend responses must match these uniform envelopes:

### 7.1 Single Entity Response (200 OK / 201 Created)
```json
{
  "message": "Entity created successfully",
  "result": {
    "id": "c27dd836-6fcc-4e03-8182-bedf6f1d436f",
    "name": "Apex Logistics India Pvt Ltd",
    "code": "CORP-01",
    "isActive": true
  }
}
```

### 7.2 Paginated List Response (200 OK)
```json
{
  "items": [
    {
      "id": "c27dd836-6fcc-4e03-8182-bedf6f1d436f",
      "_id": "c27dd836-6fcc-4e03-8182-bedf6f1d436f",
      "name": "Apex Logistics India Pvt Ltd",
      "code": "CORP-01",
      "isActive": true
    }
  ],
  "metadata": {
    "totalCount": 42,
    "currentPage": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### 7.3 Error Response (400 / 401 / 403 / 404 / 500)
```json
{
  "error": "Validation failed",
  "errors": [
    "plateNumber must be a valid registration string",
    "fuelCapacity must be a positive number"
  ]
}
```

---

## 8. Security Guardrails

1. **Passwords:** Always hash with `bcrypt` using 10 rounds (`BCRYPT_ROUNDS = 10`). Never store or log plaintext passwords.
2. **Environment Variables:** Never read, print, log, or edit `.env*` files. Always read config variables through [`backend/src/configs/environment.ts`](file:///Users/soham18/Desktop/orbito-v2/backend/src/configs/environment.ts).
3. **No Secrets in Logs:** Use Winston logger ([`backend/src/configs/logger.ts`](file:///Users/soham18/Desktop/orbito-v2/backend/src/configs/logger.ts)). Never log JWT tokens, database connection strings, or user credentials.
4. **Rate Limiting:** Protect login, authentication, and public endpoints with `express-rate-limit`.

---

## 9. Verification & Pre-Flight Checklist

Before completing any backend task, execute this verification sequence:

```bash
# 1. Compile check (Zero TypeScript errors)
cd backend && npm run build

# 2. Database migration status (Zero pending migrations)
cd backend && npm run migrate:check

# 3. Live endpoint sanity check
curl -s http://localhost:9000/v1/api/health
```

---

## 10. The "Do's and Don'ts" Checklist

| Do's (Good Practices) | Don'ts (Wrong Things to Avoid) |
|---|---|
| **DO** follow the 5 request layers in sequence (Router → Middleware → Controller → Service → Model). | **DON'T** write database queries or business logic inside controllers or routes. |
| **DO** create migrations in `src/migrations/` and register them in `runner.ts`. | **DON'T** execute manual SQL `ALTER TABLE` or `CREATE TABLE` commands. |
| **DO** wrap multi-table modifications inside `sequelize.transaction()`. | **DON'T** perform partial writes that leave corrupted or orphaned database rows. |
| **DO** protect all administrative and mutating routes with `checkPermissions`. | **DON'T** leave endpoints open without JWT authentication and RBAC guards. |
| **DO** use `class-validator` DTOs with `validateDto` middleware on mutating requests. | **DON'T** trust unvalidated client input directly from `req.body`. |
| **DO** use UUID v4 for primary keys and snake_case for column names. | **DON'T** use auto-incrementing integer IDs or camelCase SQL column names. |
| **DO** seed real, production-quality records into PostgreSQL via `seed.ts`. | **DON'T** hardcode mock objects in frontend components to simulate backend data. |
| **DO** verify with `npm run build` and `npm run migrate:check` before completing. | **DON'T** complete a backend task with uncompiled TypeScript code or pending migrations. |
| **DO** keep services <= 500 lines and controllers <= 250 lines by modularizing. | **DON'T** let service files balloon into 1000+ line monolithic god-objects. |
| **DO** use Winston `logger.info()` / `logger.error()` instead of `console.log`. | **DON'T** leave dirty `console.log` statements or print sensitive auth credentials. |
