async function getUser(baseUrl, id) {
  const res = await fetch(`${baseUrl}/users/${id}`, {
    headers: { Accept: 'application/json' },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`UserService returned ${res.status}`);
  return res.json();
}

module.exports = { getUser };