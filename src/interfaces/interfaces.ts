export interface IanalysisData {
    totalUsers: number,
    totalMale: number,
    totalFemale: number,
    otherGender: number,
    activeUsersDaily: number,
    weeklyActiveUser: number,
    monthlyActiveUser: number
}
export interface IgenderAnalysis {
    analysisData: IanalysisData
}

export interface CustomPagination {
    currentPage: number,
    totalCount: number,
    pageSize: number,
    onPageChange: (number : number) => void
}


export interface UsersData{
    id: number,
    createdAt: string,
    updatedAt: string,
    fullName: string,
    phoneNumber: string,
    emailId: string,
    password: string,
    consent: boolean,
    dob: string,
    address: string,
    pincode: string,
    emergencyContact: string,
    profileImage: null,
    QRCodeURL: null,
    isSync: boolean,
    isBlocked: false,
    refreshToken: string,
    subscription: boolean,
    country: string,
    createdBy: string,
    currentSessionId:string,
    isMigrated: false,
    verifiedContactId: string,
    gender: string,
    wrongLoginAttempts: number,
    healthRecord: {
        id: number,
        createdAt: string,
        updatedAt: string,
        bloodGroup: string,
        presentDiseases: string[],
        allergies:  string[],
        doctorFullName:  string,
        docAddress:  string,
        docPhoneNumber:  string,
        additionalInformation:  string,
        forDependantId: null,
        forUserId:  string
    }
}
