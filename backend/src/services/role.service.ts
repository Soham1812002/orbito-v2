import { Role } from "../models/role.model.js";

export class RoleService {
  static async listRoles() {
    const roles = await Role.findAll({
      order: [["name", "ASC"]]
    });
    return roles.map((r) => ({
      id: r.id,
      _id: r.id,
      name: r.name,
      description: r.description
    }));
  }
}
