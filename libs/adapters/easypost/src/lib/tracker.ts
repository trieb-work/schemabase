// @ts-ignore
import EasyPost from "@easypost/api";
import { env } from "@eci/util/env";
type TrackingStatus = "delivered" | "in_transit" | "out_for_delivery";
type TrackingDetail = {
  object: "TrackingDetail";
  message: string;
  status: TrackingStatus;
  datetime: "2014-08-21T14:48:00Z";
  tracking_location: {
    object: "TrackingLocation";
    city: "SOUTH SAN FRANCISCO";
    state: "CA";
    country: "US";
    zip: null;
  };
};
export type Tracker = {
  id: string;
  object: "Event";
  created_at: "2014-11-19T10:51:54Z";
  updated_at: "2014-11-19T10:51:54Z";
  description: "tracker.updated";
  mode: "test";
  previous_attributes: {
    status: "unknown";
  };
  pending_urls: [];
  completed_urls: [];
  result: {
    id: "trk_Txyy1vaM";
    object: "Tracker";
    mode: "test";
    tracking_code: string;
    status: TrackingStatus;
    created_at: "2014-11-18T10:51:54Z";
    updated_at: "2014-11-18T10:51:54Z";
    signed_by: "John Tester";
    weight: 17.6;
    est_delivery_date: "2014-08-27T00:00:00Z";
    shipment_id: null;
    carrier: "UPS";
    public_url: "https://track.easypost.com/djE7...";
    tracking_details: TrackingDetail[];
  };
};

export type AddTrackerRequest = {
  trackingCode: string;
  carrier: "DPD";
};
export const addTracker = async ({
  trackingCode,
  carrier,
}: AddTrackerRequest): Promise<boolean> => {
  const easypost = new EasyPost(env.require("EASYPOTS_KEY"));
  if (!easypost) {
    return false;
  }
  const tracker = new easypost.Tracker({
    tracking_code: trackingCode,
    carrier,
  });
  await tracker.save();

  return true;
};
