interface IResp {
    code: number;
    data: any;
    msg: string;
}

enum Permission {
    admin = 0,
    manager = 1,
    user = 2
}