/**
 * n8n Code node "Rückfrage" (workflow "BEER Meldungen"): passes the question back (or an
 * error message) from "Plan" to the chat as its reply.
 */
return [{ json: { output: $input.first().json.output } }];
