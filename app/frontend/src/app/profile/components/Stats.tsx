import DataField from "../../../components/DataField";

export default function Stats() {
    return (
        <>
            <h1>User stats </h1>
            <p>Not from database yet:</p>
            <DataField name="Friends" data="12" />
            <DataField name="Win/Loss ratio" data="1.0" />
            <DataField name="Achievements" data="Noob, Diehard, 3 Wins in a row, own goal" />
        </>
    );
}

//todo: get actual information from database