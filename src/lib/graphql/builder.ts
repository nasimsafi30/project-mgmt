import SchemaBuilder from '@pothos/core';

export const builder = new SchemaBuilder<{
  Context: {
    userId: string;
    permissions: any;
    cache: any;
  };
}>({});

builder.queryType({});
builder.mutationType({});
builder.subscriptionType({});