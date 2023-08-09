const consts = {
  Role: {
    USER: 0,
    EDITOR: 1,
    ADMIN: 2,
  },
  RoleName: {
    USER: "USER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN"
  }
}

export const remapRowForDBCommit = ({ id, role, email }) => {
  return { id, role: roles[role], email }
}

export const remapRowForDisplay = ({ id, role, email }) => {
  return { id, role: roleNames[role], email }
}


export default consts
