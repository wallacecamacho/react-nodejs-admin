export interface IRegister {
    senha: string;
    nome: string;
    sobreNome: string;
    password: string;
    email: string;
    telefoneCelular: string;
    google: {
        id: string;
        token: string;
    };
    captchaToken: string;
    idioma: string;
}
