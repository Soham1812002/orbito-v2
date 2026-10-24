import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, ShieldCheck, Users, Search, ArrowRight, Shield, KeyRound, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";
import { useUserList, useUserGroupList } from "@/queries/users.queries";

export const UserRightsHubPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: userData } = useUserList({ page: 1, limit: 100 });
  const { data: groupData } = useUserGroupList();

  const totalUsers = userData?.total ?? 8;
  const activeUsers = userData?.rows?.filter((u) => u.isActive).length ?? 8;
  const totalGroups = groupData?.total ?? 3;

  const cards = [
    {
      id: "users-card",
      title: "Add User & Directory",
      description: "Create user accounts, set operational allocation groups, and assign individual security policies to staff.",
      icon: UserPlus,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      badge: `${activeUsers} ACTIVE USERS`,
      badgeVariant: "cyan" as const,
      primaryAction: {
        label: "Add User",
        onClick: () => navigate("/users/new")
      },
      secondaryAction: {
        label: "View Users Directory",
        href: "/users/list"
      },
      stats: [
        { label: "Total Accounts", value: totalUsers },
        { label: "Active Access", value: activeUsers },
        { label: "Suspended", value: totalUsers - activeUsers }
      ]
    },
    {
      id: "groups-card",
      title: "User Groups & RBAC Matrix",
      description: "Organize users into operational groups, configure granular CRUD module permissions, and deploy access policies.",
      icon: ShieldCheck,
      color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
      badge: `${totalGroups} CONFIGURED GROUPS`,
      badgeVariant: "default" as const,
      primaryAction: {
        label: "Create Group",
        onClick: () => navigate("/users/groups/new")
      },
      secondaryAction: {
        label: "Manage User Groups",
        href: "/users/groups"
      },
      stats: [
        { label: "Active Roles", value: 6 },
        { label: "Assigned Groups", value: totalGroups },
        { label: "Audit Log Policy", value: "Strict" }
      ]
    }
  ];

  const filteredCards = cards.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "System Config", href: "/system-config" },
          { label: "User Rights Module" }
        ]}
        title="User Rights Module"
        description="Manage user access, group memberships, and permission policies across your fleet organization."
        badge="SECURITY & ACCESS"
        badgeVariant="cyan"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              leftIcon={<Users className="h-4 w-4" />}
              onClick={() => navigate("/users/list")}
            >
              Users Directory
            </Button>
            <Button
              variant="primary"
              leftIcon={<Shield className="h-4 w-4" />}
              onClick={() => navigate("/users/groups")}
            >
              User Groups & RBAC
            </Button>
          </div>
        }
      />

      {/* Search Header Bar matching Figma */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#0F172B] border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Role-Based Access Control Governance
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enterprise isolation with company boundaries, branch scoping, and granular CRUD permissions
            </p>
          </div>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search existing system modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus-ring"
          />
        </div>
      </div>

      {/* Elevated Action Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="panel-card flex flex-col justify-between hover:border-blue-500/40 hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${card.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="badge-pill border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {card.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {card.description}
                </p>

                {/* Key Metrics Mini-Bar */}
                <div className="grid grid-cols-3 gap-2 mt-5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80">
                  {card.stats.map((stat, idx) => (
                    <div key={idx} className="text-center">
                      <p className="text-2xs uppercase tracking-wider text-slate-400 font-semibold">
                        {stat.label}
                      </p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
                <Link
                  to={card.secondaryAction.href}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 focus-ring rounded-lg px-2 py-1 transition-colors"
                >
                  {card.secondaryAction.label}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={card.primaryAction.onClick}
                >
                  {card.primaryAction.label}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security Best Practices Banner */}
      <div className="p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-bold text-slate-900 dark:text-white">
            SOC-2 Type II & ISO 27001 Access Governance
          </p>
          <p className="text-slate-600 dark:text-slate-300 mt-0.5">
            Passwords enforce 3-generation history and 30-day rotation. All administrative permission changes are automatically captured in the immutable Audit Trail.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserRightsHubPage;
