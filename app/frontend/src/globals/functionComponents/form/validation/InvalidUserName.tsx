export default function InvalidUserName(name: string) : boolean {
    const minLength: number = 3;
    const maxLength: number = 30; //todo: consider to add these values to global constants

    if (name.length < minLength || name.length > maxLength)
        return (true);
    return (false);
}
