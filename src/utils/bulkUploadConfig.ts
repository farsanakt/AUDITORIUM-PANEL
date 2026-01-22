import { UploadType } from "../types/Bulkupload";

export const REQUIRED_COLUMNS: Record<UploadType, string[]> = {
  AUDITORIUM_USER: [
    "email",
    "password",
    "phone",
    "auditoriumName",
    "ownerName",
    "address",
    "district"
  ],

  AUDITORIUM_BOOKING: [
    "userEmail",
    "venueId",
    "auditoriumId",
    "venueName",
    "bookeddate",
    "timeSlot",
    "totalAmount",
    "paidAmount",
    "balanceAmount",
    "paymentStatus",
    "address"
  ],

  VENDOR: [
    "name",
    "vendorUserId",
    "email",
    "phone",
    "pincode",
    "cities",
    "vendorType",
    "startingPrice",
    "advAmnt"
  ]
};
