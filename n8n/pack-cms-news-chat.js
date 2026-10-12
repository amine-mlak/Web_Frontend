"use strict";

const fs = require("fs");
const path = require("path");

const dir = __dirname;
const jsCode = fs.readFileSync(path.join(dir, "cms-chat-draft.js"), "utf8");

const workflow = {
  name: "BEER CMS news chat (draft only)",
  nodes: [
    {
      parameters: {
        content:
          "## BEER CMS-Chat\n\nHosts (do not mix up):\n- n8n: `https://n8n.beer.de`\n- Strapi: `https://cms.beer.de`  (`/admin`, `/api`)\n\nEnv on n8n.beer.de:\n- `STRAPI_URL` = `https://cms.beer.de`\n- `STRAPI_API_TOKEN` — nur Entwürfe, **kein Publish**\n- `N8N_LLM_BASE_URL` = `https://openrouter.ai/api/v1`\n- `N8N_LLM_API_KEY` or `OPENROUTER_API_KEY`\n- `N8N_LLM_MODEL` = `openai/gpt-4o-mini`\n\nChat: hosted on n8n.beer.de. sslip copies are not live.\n\nZuordnung:\n- News / Presse / Termin → Artikel + Kategorie **presse** → `/presse/[slug]`\n- Ratgeber → Artikel + kosten / planung / geraete / material → `/ratgeber/[slug]`\n- Impressum, Datenschutz → **site-pages**\n\nImmer locale `de`. Immer draft. Mensch veröffentlicht.\nOpenAPI: `https://cms.beer.de/documentation` (public, no password).",
        height: 460,
        width: 340,
        color: 7,
      },
      type: "n8n-nodes-base.stickyNote",
      typeVersion: 1,
      position: [-200, 120],
      id: "9e601c32-4d5f-4133-ae70-2c3d4e5f6071",
      name: "Hinweis",
    },
    {
      parameters: {
        public: true,
        mode: "hostedChat",
        options: {
          allowFileUploads: false,
          responseMode: "lastNode",
        },
      },
      type: "@n8n/n8n-nodes-langchain.chatTrigger",
      typeVersion: 1.1,
      position: [220, 300],
      id: "7c4e9a10-2b3d-4f11-8c5e-0a1b2c3d4e5f",
      name: "When chat message received",
      webhookId: "0f712d43-5e60-4244-bf81-3d4e5f607182",
    },
    {
      parameters: {
        jsCode,
      },
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [560, 300],
      id: "8d5f0b21-3c4e-4022-9d6f-1b2c3d4e5f60",
      name: "Draft into Strapi",
    },
  ],
  connections: {
    "When chat message received": {
      main: [
        [
          {
            node: "Draft into Strapi",
            type: "main",
            index: 0,
          },
        ],
      ],
    },
  },
  settings: {
    executionOrder: "v1",
    saveDataErrorExecution: "all",
    saveDataSuccessExecution: "all",
    saveManualExecutions: true,
    timezone: "Europe/Berlin",
    callerPolicy: "workflowsFromSameOwner",
  },
  staticData: null,
  pinData: {},
};

fs.writeFileSync(
  path.join(dir, "cms-news-chat.json"),
  `${JSON.stringify(workflow, null, 2)}\n`,
);

console.log("wrote n8n/cms-news-chat.json");
