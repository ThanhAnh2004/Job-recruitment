import { Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type ResumeDocumet = HydratedDocument<Resume>;

export class Resume {
    @Prop()
    email: string;

    @Prop()
    userId: mongoose.Schema.Types.ObjectId;

    @Prop()
    url: string;

    @Prop()
    status: string;

    @Prop()
    jobId: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.Array })
    history: {
        status: string,
        updateAt: Date,
        updateBy: {
            _id: mongoose.Schema.Types.ObjectId,
            email: string
        }
    }[]

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    @Prop()
    isDeleted: boolean;

    @Prop()
    deletedAt: Date;

    @Prop({ type: Object })
    createdBy: {
        id: mongoose.Schema.Types.ObjectId,
        email: string
    }

    @Prop({ type: Object })
    updatedBy: {
        id: mongoose.Schema.Types.ObjectId,
        email: string
    }
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);