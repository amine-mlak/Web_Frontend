/**
 * n8n Code node "Auftrag" (workflow "BEER Mediathek"): the one Strapi read of a run.
 * GET /api/upload/files ignores pagination and returns every file at once.
 */

return [{ json: { url: `${CMS}/api/upload/files` } }];
