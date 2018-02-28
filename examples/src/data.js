import casual from 'casual-browserify'

export const makeData = length => {
  const data = []
  for (let i = 0; i < length; i += 1) {
    data.push({
      username: casual.username,
      firstName: casual.first_name,
      lastName: casual.last_name,
      fullName: casual.full_name,
      password: casual.password,
      companyName: casual.company_name,
      catchPhrase: casual.catch_phrase,
      phone: casual.phone,
    })
  }
  return data
}

export const makeError = () => ({
  title: casual.title,
  description: casual.short_description,
})

export const makeErrors = length => {
  const data = []
  for (let i = 0; i < length; i += 1) {
    data.push({
      title: casual.title,
      description: casual.short_description,
    })
  }
  return data
}
