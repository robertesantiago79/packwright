export function defineUnionMembers<Union extends PropertyKey>() {
  return <Members extends readonly Union[]>(
    members: Exclude<Union, Members[number]> extends never ? Members : never,
  ): Members => members;
}
