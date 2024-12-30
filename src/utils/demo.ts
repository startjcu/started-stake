interface IPerson {
  name: string
}
function greet(person: IPerson) {
  return `Hello ${person.name}`
}

greet({ name: 'Alan' })