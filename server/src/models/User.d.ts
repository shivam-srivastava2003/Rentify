import mongoose from 'mongoose';
declare const User: mongoose.Model<{
    name: string;
    email: string;
    password: string;
    role: "ADMIN" | "OWNER" | "USER";
    phone: string;
    city: string;
    businessName: string;
    propertyLocation: string;
    unitCount: string;
    isActive: boolean;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    name: string;
    email: string;
    password: string;
    role: "ADMIN" | "OWNER" | "USER";
    phone: string;
    city: string;
    businessName: string;
    propertyLocation: string;
    unitCount: string;
    isActive: boolean;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    name: string;
    email: string;
    password: string;
    role: "ADMIN" | "OWNER" | "USER";
    phone: string;
    city: string;
    businessName: string;
    propertyLocation: string;
    unitCount: string;
    isActive: boolean;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    email: string;
    password: string;
    role: "ADMIN" | "OWNER" | "USER";
    phone: string;
    city: string;
    businessName: string;
    propertyLocation: string;
    unitCount: string;
    isActive: boolean;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    name: string;
    email: string;
    password: string;
    role: "ADMIN" | "OWNER" | "USER";
    phone: string;
    city: string;
    businessName: string;
    propertyLocation: string;
    unitCount: string;
    isActive: boolean;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    name: string;
    email: string;
    password: string;
    role: "ADMIN" | "OWNER" | "USER";
    phone: string;
    city: string;
    businessName: string;
    propertyLocation: string;
    unitCount: string;
    isActive: boolean;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, unknown, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    name: string;
    email: string;
    password: string;
    role: "ADMIN" | "OWNER" | "USER";
    phone: string;
    city: string;
    businessName: string;
    propertyLocation: string;
    unitCount: string;
    isActive: boolean;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    name: string;
    email: string;
    password: string;
    role: "ADMIN" | "OWNER" | "USER";
    phone: string;
    city: string;
    businessName: string;
    propertyLocation: string;
    unitCount: string;
    isActive: boolean;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default User;
//# sourceMappingURL=User.d.ts.map