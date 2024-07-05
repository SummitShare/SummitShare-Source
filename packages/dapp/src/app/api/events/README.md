## Creating an event

1.  **Event Created and Stakeholders Added (Create Events API)**

    - data required to send an event.`api/events/createEvent`

    ```json
    {
      "user_id": "1be3c37d-106c-49e0-9346-06ec291602a2",
      "proposal": {
        "event_type": "Physical",
        "event_name": "Sample Event",
        "event_category": "solo_exhibitions",
        "event_start_time": "2023-01-01T12:00:00Z",
        "event_timezone": "UTC",
        "event_location": "Sample Location",
        "description": "A description of the event",
        "event_end_time": "2023-01-01T18:00:00Z",
        "cost": 50,
        "total_number_tickets": 100,
        "symbol": "SI"
      },
      "emailsArray": ["a@example.com", "b@example.com"]
    }
    ```

2.  **Stakeholders Accept Requests sent to their registered emails**

    Stakeholders can accept requests by following the link in their mail.

    Users who are not verified will be redirected to a verification page and then to their dashboard.

    A verification page needs to be created for this .

3.  **New Proposal Sent with Stakes for Added Stakeholders (Create New Proposal)**

        `api/events/proposals/CreateNewProposal`

    ```json
    {
      "event_id": "8669fb05-0151-4dab-90c0-a41aed2aaf96",
      "user_id": "1be3c37d-106c-49e0-9346-06ec291602a2",
      "proposal": {
        "event_type": "Physical",
        "event_name": "changed name",
        "event_category": "solo_exhibitions",
        "event_start_time": "2023-01-01T12:00:00Z",
        "event_timezone": "UTC",
        "event_location": "Sample Location",
        "description": "A description of the event",
        "event_end_time": "2023-01-01T18:00:00Z",
        "cost": 50,
        "total_number_tickets": 100,
        "symbol": "SI"
      },
      "stakes": {
        "a@example.com": 50,
        "b@example.com": 50
      }
    }
    ```

    This is done once all users have accepted the invite to an event and stakes can be added

    - Use the previous form, but stakes will be added instead of emails. Note that this uses a different API than the initial creation.

    - Advise users to select Events > Proposals > Create New Proposal to reach the form to create a new proposal.

4.  **Vote (Voting API)**

- The creator of an event will not need to vote as they created the proposal.

- To vote, send a user id, proposal id, and vote.

```json
{
  "proposal_id": "8d7148ad-c308-4623-964d-19e8675a200e",
  "Vote": true,
  "user_id": "63478ab8-537b-444e-9cb0-d34e14ce0fb6"
}
```

5. **Deployment**

- Once all stakeholders have voted yes on a proposal the event is updated and the exhibit deployed
