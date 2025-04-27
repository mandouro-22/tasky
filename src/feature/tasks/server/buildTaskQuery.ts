import { Query } from "node-appwrite";

export function buildTaskQuery(
  workspaceId: string,
  filters: Record<string, string | undefined>,
  search?: string | undefined | null
) {
  const query = [
    Query.equal("workspaceId", workspaceId),
    Query.orderAsc("$createdAt"),
  ];

  for (const [key, value] of Object.entries(filters)) {
    if (value) {
      query.push(Query.equal(key, value));
    }
  }

  if (search) {
    query.push(Query.search("name", search));
  }
  return query;
}
