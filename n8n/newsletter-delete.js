// "Löschen" on the newsletter page: only a numeric row id goes on to the table node.
const id = Number.parseInt(String($input.first().json.body?.id ?? ""), 10);
return [{ json: { id: Number.isFinite(id) && id > 0 ? id : -1 } }];
