import { Listing } from "./listing";

export interface Agent {
    name: string;
    company: string;
    phone: string;
    email: string;
    avatar: string;
}

export interface Enquiry {
    _id: string;
    userId: string;
    listingId: Listing;
    status: "ENQUIRED" | "CONTACTED" | string;
    name: string;
    email: string;
    phone: string;
    postalCode: string;
    country: string;
    message: string;
    createdAt: string;
    updatedAt: string;
}

export interface AgencyProfile {
    agencyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    website: string;
    companyRegNumber: string;
    addressLine1: string;
    city: string;
    postcode: string;
    description: string;
}
