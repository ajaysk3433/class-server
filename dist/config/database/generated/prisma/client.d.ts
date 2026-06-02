import * as runtime from "@prisma/client/runtime/client";
import * as $Class from "./internal/class.ts";
import * as Prisma from "./internal/prismaNamespace.ts";
export * as $Enums from './enums.ts';
export * from "./enums.ts";
/**
 * ## Prisma Client
 *
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Streams
 * const streams = await prisma.stream.findMany()
 * ```
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export declare const PrismaClient: $Class.PrismaClientConstructor;
export type PrismaClient<LogOpts extends Prisma.LogLevel = never, OmitOpts extends Prisma.PrismaClientOptions["omit"] = Prisma.PrismaClientOptions["omit"], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = $Class.PrismaClient<LogOpts, OmitOpts, ExtArgs>;
export { Prisma };
/**
 * Model Stream
 *
 */
export type Stream = Prisma.StreamModel;
/**
 * Model Class
 *
 */
export type Class = Prisma.ClassModel;
/**
 * Model Section
 *
 */
export type Section = Prisma.SectionModel;
/**
 * Model Subject
 *
 */
export type Subject = Prisma.SubjectModel;
/**
 * Model ClassStreamSection
 *
 */
export type ClassStreamSection = Prisma.ClassStreamSectionModel;
/**
 * Model ClassSubject
 *
 */
export type ClassSubject = Prisma.ClassSubjectModel;
/**
 * Model UserClass
 *
 */
export type UserClass = Prisma.UserClassModel;
/**
 * Model User
 *
 */
export type User = Prisma.UserModel;
/**
 * Model School
 *
 */
export type School = Prisma.SchoolModel;
/**
 * Model Role
 *
 */
export type Role = Prisma.RoleModel;
