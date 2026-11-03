/**
 * n8n Code node "Fotos" (workflow "BEER Projekttexte").
 * One item per photo that needs a description. "Foto laden" fetches it and "Anfrage bauen"
 * writes the request. The facts leave out the place and the intro: the place must not appear
 * in the description, and the intro talks about the whole project rather than this photo.
 */

const items = [];
for (const { json: project } of $input.all()) {
  const specs = project.specs.filter((spec) => spec.label !== "Ort").map((spec) => `${spec.label}: ${spec.value}`);
  for (const photo of project.photos) {
    items.push({
      json: {
        documentId: project.documentId,
        photo,
        place: project.place,
        facts: [`Titel: ${project.title}`, ...specs].join("\n"),
      },
    });
  }
}
return items;
