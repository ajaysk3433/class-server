import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.ts';
export type * from './prismaNamespace.ts';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly Stream: "Stream";
    readonly Class: "Class";
    readonly Section: "Section";
    readonly Subject: "Subject";
    readonly ClassStreamSection: "ClassStreamSection";
    readonly ClassSubject: "ClassSubject";
    readonly UserClass: "UserClass";
    readonly User: "User";
    readonly School: "School";
    readonly Role: "Role";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const StreamScalarFieldEnum: {
    readonly id: "id";
    readonly stream_name: "stream_name";
    readonly slug: "slug";
};
export type StreamScalarFieldEnum = (typeof StreamScalarFieldEnum)[keyof typeof StreamScalarFieldEnum];
export declare const ClassScalarFieldEnum: {
    readonly id: "id";
    readonly class_name: "class_name";
    readonly slug: "slug";
};
export type ClassScalarFieldEnum = (typeof ClassScalarFieldEnum)[keyof typeof ClassScalarFieldEnum];
export declare const SectionScalarFieldEnum: {
    readonly id: "id";
    readonly section_name: "section_name";
    readonly slug: "slug";
};
export type SectionScalarFieldEnum = (typeof SectionScalarFieldEnum)[keyof typeof SectionScalarFieldEnum];
export declare const SubjectScalarFieldEnum: {
    readonly id: "id";
    readonly subject_name: "subject_name";
    readonly slug: "slug";
    readonly board: "board";
    readonly language: "language";
    readonly stream_id: "stream_id";
};
export type SubjectScalarFieldEnum = (typeof SubjectScalarFieldEnum)[keyof typeof SubjectScalarFieldEnum];
export declare const ClassStreamSectionScalarFieldEnum: {
    readonly id: "id";
    readonly school_id: "school_id";
    readonly class_id: "class_id";
    readonly stream_id: "stream_id";
    readonly section_id: "section_id";
    readonly slug: "slug";
};
export type ClassStreamSectionScalarFieldEnum = (typeof ClassStreamSectionScalarFieldEnum)[keyof typeof ClassStreamSectionScalarFieldEnum];
export declare const ClassSubjectScalarFieldEnum: {
    readonly class_id: "class_id";
    readonly subject_id: "subject_id";
};
export type ClassSubjectScalarFieldEnum = (typeof ClassSubjectScalarFieldEnum)[keyof typeof ClassSubjectScalarFieldEnum];
export declare const UserClassScalarFieldEnum: {
    readonly user_id: "user_id";
    readonly class_stream_section_id: "class_stream_section_id";
};
export type UserClassScalarFieldEnum = (typeof UserClassScalarFieldEnum)[keyof typeof UserClassScalarFieldEnum];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly full_name: "full_name";
    readonly email: "email";
    readonly role_id: "role_id";
    readonly status: "status";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const SchoolScalarFieldEnum: {
    readonly id: "id";
    readonly school_name: "school_name";
    readonly slug: "slug";
    readonly status: "status";
};
export type SchoolScalarFieldEnum = (typeof SchoolScalarFieldEnum)[keyof typeof SchoolScalarFieldEnum];
export declare const RoleScalarFieldEnum: {
    readonly id: "id";
    readonly role_name: "role_name";
};
export type RoleScalarFieldEnum = (typeof RoleScalarFieldEnum)[keyof typeof RoleScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const StreamOrderByRelevanceFieldEnum: {
    readonly stream_name: "stream_name";
    readonly slug: "slug";
};
export type StreamOrderByRelevanceFieldEnum = (typeof StreamOrderByRelevanceFieldEnum)[keyof typeof StreamOrderByRelevanceFieldEnum];
export declare const ClassOrderByRelevanceFieldEnum: {
    readonly class_name: "class_name";
    readonly slug: "slug";
};
export type ClassOrderByRelevanceFieldEnum = (typeof ClassOrderByRelevanceFieldEnum)[keyof typeof ClassOrderByRelevanceFieldEnum];
export declare const SectionOrderByRelevanceFieldEnum: {
    readonly section_name: "section_name";
    readonly slug: "slug";
};
export type SectionOrderByRelevanceFieldEnum = (typeof SectionOrderByRelevanceFieldEnum)[keyof typeof SectionOrderByRelevanceFieldEnum];
export declare const SubjectOrderByRelevanceFieldEnum: {
    readonly subject_name: "subject_name";
    readonly slug: "slug";
    readonly board: "board";
    readonly language: "language";
};
export type SubjectOrderByRelevanceFieldEnum = (typeof SubjectOrderByRelevanceFieldEnum)[keyof typeof SubjectOrderByRelevanceFieldEnum];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const ClassStreamSectionOrderByRelevanceFieldEnum: {
    readonly slug: "slug";
};
export type ClassStreamSectionOrderByRelevanceFieldEnum = (typeof ClassStreamSectionOrderByRelevanceFieldEnum)[keyof typeof ClassStreamSectionOrderByRelevanceFieldEnum];
export declare const UserOrderByRelevanceFieldEnum: {
    readonly full_name: "full_name";
    readonly email: "email";
    readonly status: "status";
};
export type UserOrderByRelevanceFieldEnum = (typeof UserOrderByRelevanceFieldEnum)[keyof typeof UserOrderByRelevanceFieldEnum];
export declare const SchoolOrderByRelevanceFieldEnum: {
    readonly school_name: "school_name";
    readonly slug: "slug";
    readonly status: "status";
};
export type SchoolOrderByRelevanceFieldEnum = (typeof SchoolOrderByRelevanceFieldEnum)[keyof typeof SchoolOrderByRelevanceFieldEnum];
export declare const RoleOrderByRelevanceFieldEnum: {
    readonly role_name: "role_name";
};
export type RoleOrderByRelevanceFieldEnum = (typeof RoleOrderByRelevanceFieldEnum)[keyof typeof RoleOrderByRelevanceFieldEnum];
