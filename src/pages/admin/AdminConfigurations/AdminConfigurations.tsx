import React from "react";
import {
  Settings,
  Globe,
  Users,
  Shield,
  Key,
  Database,
  Server,
  Cog,
} from "lucide-react";
import { COLORS } from "../../../constants/colors";

const AdminConfigurations: React.FC = () => {
  const configSections = [
    {
      title: "System Settings",
      icon: Settings,
      configs: [
        { name: "Platform Name", value: "Trading CRM Pro", type: "text" },
        { name: "Base Currency", value: "USD", type: "select" },
        { name: "Time Zone", value: "UTC+0", type: "select" },
        { name: "Session Timeout", value: "30 minutes", type: "select" },
      ],
    },
    {
      title: "Trading Settings",
      icon: Globe,
      configs: [
        { name: "Max Leverage", value: "1:500", type: "select" },
        { name: "Min Deposit", value: "$100", type: "number" },
        { name: "Max Deposit", value: "$50,000", type: "number" },
        { name: "Spread Type", value: "Variable", type: "select" },
      ],
    },
    {
      title: "User Management",
      icon: Users,
      configs: [
        { name: "Auto Verification", value: "Disabled", type: "toggle" },
        { name: "Max Login Attempts", value: "5", type: "number" },
        { name: "Password Policy", value: "Strong", type: "select" },
        { name: "Two Factor Auth", value: "Optional", type: "select" },
      ],
    },
    {
      title: "Security Settings",
      icon: Shield,
      configs: [
        { name: "SSL Encryption", value: "Enabled", type: "toggle" },
        { name: "API Rate Limiting", value: "1000/hour", type: "number" },
        { name: "IP Whitelist", value: "Disabled", type: "toggle" },
        { name: "Audit Logging", value: "Enabled", type: "toggle" },
      ],
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold text-${COLORS.SECONDARY}`}>
              System Configurations
            </h1>
            <p className={`text-${COLORS.SECONDARY_TEXT} mt-1`}>
              Manage system settings and platform configurations
            </p>
          </div>
          <button
            className={`bg-${COLORS.PRIMARY} text-${COLORS.WHITE} px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2`}
          >
            <Database className="h-4 w-4" />
            Backup Settings
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <div className="flex items-center">
            <div className={`bg-${COLORS.PRIMARY_BG_LIGHT} p-3 rounded-lg`}>
              <Cog className={`h-6 w-6 text-${COLORS.PRIMARY}`} />
            </div>
            <div className="ml-4">
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>
                Total Configs
              </p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
                47
              </p>
            </div>
          </div>
        </div>

        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <div className="flex items-center">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>
                Security Level
              </p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
                High
              </p>
            </div>
          </div>
        </div>

        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <div className="flex items-center">
            <div className="bg-purple-50 p-3 rounded-lg">
              <Server className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>
                Server Status
              </p>
              <p className={`text-2xl font-semibold text-green-600`}>Online</p>
            </div>
          </div>
        </div>

        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <div className="flex items-center">
            <div className={`bg-${COLORS.YELLOW_BG} p-3 rounded-lg`}>
              <Database className={`h-6 w-6 text-${COLORS.YELLOW_TEXT}`} />
            </div>
            <div className="ml-4">
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>
                Last Backup
              </p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
                2h ago
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {configSections.map((section, index) => {
          const IconComponent = section.icon;
          return (
            <div
              key={index}
              className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER}`}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <div
                    className={`bg-${COLORS.PRIMARY_BG_LIGHT} p-2 rounded-lg mr-3`}
                  >
                    <IconComponent
                      className={`h-5 w-5 text-${COLORS.PRIMARY}`}
                    />
                  </div>
                  <h2
                    className={`text-lg font-semibold text-${COLORS.SECONDARY}`}
                  >
                    {section.title}
                  </h2>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {section.configs.map((config, configIndex) => (
                    <div
                      key={configIndex}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <label
                          className={`font-medium text-${COLORS.SECONDARY}`}
                        >
                          {config.name}
                        </label>
                        <p className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>
                          Current: {config.value}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {config.type === "toggle" ? (
                          <button
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              config.value === "Enabled"
                                ? `bg-${COLORS.PRIMARY}`
                                : `bg-${COLORS.GRAY}`
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                config.value === "Enabled"
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                        ) : config.type === "select" ? (
                          <select
                            className={`px-3 py-1 border border-${COLORS.BORDER} rounded-lg text-sm focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}
                          >
                            <option value={config.value}>{config.value}</option>
                          </select>
                        ) : (
                          <input
                            type={config.type}
                            defaultValue={config.value}
                            className={`px-3 py-1 border border-${COLORS.BORDER} rounded-lg text-sm focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent w-24`}
                          />
                        )}
                        <button
                          className={`text-${COLORS.PRIMARY} hover:text-green-700 transition-colors text-sm font-medium`}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* API Settings */}
      <div
        className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER} mt-6`}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className={`bg-${COLORS.PRIMARY_BG_LIGHT} p-2 rounded-lg mr-3`}
              >
                <Key className={`h-5 w-5 text-${COLORS.PRIMARY}`} />
              </div>
              <h2 className={`text-lg font-semibold text-${COLORS.SECONDARY}`}>
                API Configuration
              </h2>
            </div>
            <button
              className={`bg-${COLORS.PRIMARY} text-${COLORS.WHITE} px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm`}
            >
              Generate New Key
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className={`block font-medium text-${COLORS.SECONDARY} mb-2`}
              >
                API Key
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value="sk_live_***************************"
                  readOnly
                  className={`flex-1 px-3 py-2 border border-${COLORS.BORDER} rounded-lg bg-${COLORS.SECONDARY_BG} text-${COLORS.SECONDARY_TEXT}`}
                />
                <button
                  className={`text-${COLORS.PRIMARY} hover:text-green-700 transition-colors text-sm font-medium`}
                >
                  Copy
                </button>
              </div>
            </div>

            <div>
              <label
                className={`block font-medium text-${COLORS.SECONDARY} mb-2`}
              >
                Webhook URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value="https://api.yourplatform.com/webhook"
                  className={`flex-1 px-3 py-2 border border-${COLORS.BORDER} rounded-lg focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}
                />
                <button
                  className={`text-${COLORS.PRIMARY} hover:text-green-700 transition-colors text-sm font-medium`}
                >
                  Test
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminConfigurations;
