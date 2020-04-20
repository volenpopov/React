const parseEvents = (events, userId = null) => {
  const eventsKeys = Object.keys(events);
console.log(userId);

  let fetchedEvents = [];

  if (eventsKeys.length) {
    const currentDateNumber = Date.parse(new Date());

    fetchedEvents = eventsKeys
      .map(key => ({ id: key, ...events[key] }))
      .filter(event => {
        const eventDate = new Date(event.date);
        const eventDateNumber = Date.parse(eventDate);

        if (userId) {
          return event.creator !== userId && currentDateNumber <= eventDateNumber;
        }

        return currentDateNumber <= eventDateNumber;
      });
  }

  return fetchedEvents;
};

export default parseEvents;
