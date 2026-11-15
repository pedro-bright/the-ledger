import { load, YAML11_SCHEMA } from "js-yaml";

// js-yaml 5 defaults to the YAML 1.2 core schema, which reads unquoted dates as
// strings and drops merge keys. The YAML 1.1 schema keeps the values that
// version 4 produced for the content files. Like version 4, `load` throws on a
// file with more than one document; unlike it, it also throws on an empty file.
export function loadYaml(raw: string): unknown {
  return load(raw, { schema: YAML11_SCHEMA });
}
