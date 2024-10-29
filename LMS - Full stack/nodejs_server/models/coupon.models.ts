import mongoose, {Document,Model,Schema, ObjectId }  from "mongoose";

export interface ICouponSchema extends Document{
   couponCode: string;
   status: string;
   count:number;
   userId: ObjectId;
   courseId : ObjectId;
   discount:number;
   maxCount:number;
}

const couponSchema = new Schema<ICouponSchema>({
    couponCode:{
        type:String,
        required: true,
    },
    status:{
        type: String,
        required: true,
        default: "ACTIVE"
    },
    count:{
        type: Number,
        required: true,
        default: 0
    },
        userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      courseId: [{
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
      }],
      discount:{
        type: Number,
        required: true,
        default: 0
      },
      maxCount:{
        type: Number,
        required: true,
        default: 0
      }
},{timestamps: true});


const CouponCodeModel: Model<ICouponSchema> = mongoose.model('Coupon',couponSchema);

export default CouponCodeModel;