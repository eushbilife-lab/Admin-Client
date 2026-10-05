

const PrivilegeService = {

    checkPrivilege: (access: String, privilege:any) => {
       return privilege.includes(access)

    }

}

export default PrivilegeService