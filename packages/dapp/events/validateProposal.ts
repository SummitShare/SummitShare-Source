
interface IPropsal {
    event_type: EventType; // assuming event_type_enum is a string enum
    event_name: string;
    event_category: EventCategory; // assuming event_category_enum is a string enum
    event_start_time: Date;
    event_timezone: string;
    event_location: string;
    description: string;
    event_end_time: Date;
    cost: number; // Decimal type in Prisma translates to number in TypeScript
    total_number_tickets: number;
    // Additional properties for relations can be added if needed
}
type EventType = "Physical" | "Virtual";
type EventCategory = "solo_exhibitions" | "group_exhibitions" | "museum_exhibitions" | "art_event_exhibitions";


export default function validateProposal(proposal: IPropsal): string | null {
    // Validate each field in the proposal
    return (
        validateEventType(proposal.event_type) &&
        validateString(proposal.event_name, "event_name") &&
        validateEventCategory(proposal.event_category) &&
        validateDate(proposal.event_start_time, "start time") &&
        validateString(proposal.event_timezone, "event_timezone") &&
        validateString(proposal.event_location, "event_location") &&
        validateString(proposal.description, "description") &&
        validateDate(proposal.event_end_time, "end time") &&
        validateCost(proposal.cost) &&
        validateNumberTickets(proposal.total_number_tickets)
    );
}

function validateString(value: string, fieldName: string): string | null {
    // Example: String fields should not be empty
    if (typeof value !== 'string' || value.trim().length === 0) {
        return `${fieldName} must be a non-empty string.`;
    }
    return null;
}

function validateEventType(eventType: EventType): string | null {
    const EventTypeOptions = ["Physical", "Virtual"];
    if (!EventTypeOptions.includes(eventType)) {
        return `Invalid event type.`;
    }
    return null;
}

function validateEventCategory(eventCategory: EventCategory): string | null {
    const EventCategoryOptions = ["solo_exhibitions", "group_exhibitions", "museum_exhibitions", "art_event_exhibitions"];
    if (!EventCategoryOptions.includes(eventCategory)) {
        return `Invalid event category.`;
    }
    return null;
}

function validateDate(date: Date, fieldName: string): string | null {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        return `${fieldName} must be a valid date.`;
    }
    return null;
}

function validateCost(cost: number): string | null {
    if (typeof cost !== 'number' || cost < 0) {
        return `Cost must be a non-negative number.`;
    }
    return null;
}

function validateNumberTickets(tickets: number): string | null {
    if (!Number.isInteger(tickets) || tickets <= 0) {
        return `Total number of tickets must be a positive integer.`;
    }
    return null;
}

