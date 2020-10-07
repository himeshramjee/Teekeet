it("Can like to be like kiff ekse", async () => {
  const ticketsData = [
    { title: "Happy pup", price: "R1,010.10" },
    { title: "Happier pupper", price: "R1,010.20" },
    { title: "Happiest puppy", price: "R1,010.30" },
  ];

  let ticketDescriptions = new Array();

  await Promise.all(
    ticketsData.map(async (ticket) => {
      const newT = await getDescription(ticket.title, ticket.price);
      ticketDescriptions.push(newT);
    })
  );

  expect(ticketDescriptions.length).toEqual(3);
});

const getDescription = (title: String, price: String) => {
  return { description: `${title} costs ${price} bucks!` };
};
