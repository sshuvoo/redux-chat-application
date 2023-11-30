export default function getPartnerInfo(users, email) {
   return users.find((user) => user.email !== email);
}
