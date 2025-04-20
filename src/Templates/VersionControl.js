import { Add, BuildRun } from "@carbon/icons-react";
import { Accordion, AccordionItem, Button, ContentSwitcher, Switch, Tag, TextArea, TextInput, Tile } from "@carbon/react";
import axios from "axios";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import BuildStatus from "./BuildStatus";

const VersionControl = () => {
    const loaderData = useLoaderData();
    const [template, setTemplate] = useState(loaderData.template);
    const [newVersionName, setNewVersionName] = useState("");
    const [enviroinment, setEnviroinment] = useState("");
    const [description, setDescription] = useState("");
    const [versions, setVersions] = useState(loaderData.templateVersions);
    const [acitiveView, setActiveView] = useState("version");

    const createVersion = () => {
        axios.post(`/template/version-control/${template.id}`, {
            version: newVersionName,
            enviroinment,
            description
        }).then((res) => {
            if (res.status === 200) {
                setVersions((existing) => [{
                    version: newVersionName,
                    description
                }, ...existing])
            }
        })
    }

    const updateBuild = (version, type) =>
        axios.post(`/template/build/${template.id}`, {
            version,
            type
        }).then((res) => {
            if (res.status === 200) {
                if (type === "Build") {
                    setTemplate((existing) => ({ ...existing, buildVersion: version }))
                    setActiveView("status")
                } else if (type === "Dev") {
                    setTemplate((existing) => ({ ...existing, devVersion: version }))
                }
            }
        })


    return (<>
        <h4 style={{ marginBottom: "15px" }}>Template Source Control</h4>
        {/* <h3>{template.name}</h3> */}
        <ContentSwitcher
            selectedIndex={acitiveView === "version" ? 0 : 1}
            onChange={(e) => {
                setActiveView(e.name)
            }}>
            <Switch name="version" text="Version Control" />
            <Switch name="status" text="Build Status"></Switch>
        </ContentSwitcher>
        {acitiveView === "version" &&
            <>
                <Tile>
                    <TextInput
                        id="text-input-version-name"
                        labelText="Version"
                        value={newVersionName}
                        onChange={(e) => {
                            setNewVersionName(e.target.value);
                        }}
                    />
                    <TextInput
                        id="text-input-env-name"
                        labelText="Specify enviroinment to build"
                        value={enviroinment}
                        onChange={(e) => {
                            setEnviroinment(e.target.value);
                        }}
                    />
                    <TextArea
                        id="input-description"
                        type="text"
                        labelText="Description"
                        value={description || ""}
                        onChange={(e) => setDescription(e.target.value)} />
                    <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                        <Button renderIcon={Add} style={{ marginTop: "10px" }} onClick={createVersion}>
                            New Version
                        </Button>
                    </div>
                </Tile>
                <Accordion>
                    {versions.map((item) =>
                        <AccordionItem key={item.version} title={
                            <>{item.version}
                                {template.productionVersion === item.version &&
                                    <Tag className="some-class" type="cyan">
                                        {'Production'}
                                    </Tag>}
                                {template.buildVersion === item.version &&
                                    <Tag className="some-class" type="outline">
                                        {'Build'}
                                    </Tag>}
                                {template.devVersion === item.version &&
                                    <Tag className="some-class" type='gray'>
                                        {'Dev'}
                                    </Tag>}
                            </>}>
                            <p>{item.description}</p>
                            <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                                <Button
                                    kind="secondary"
                                    onClick={() => updateBuild(item.version, "Dev")}
                                    disabled={template.devVersion === item.version}>
                                    Mark as dev
                                </Button>
                                <Button
                                    renderIcon={BuildRun}
                                    onClick={() => updateBuild(item.version, "Build")}
                                    disabled={template.buildVersion === item.version}>
                                    Build
                                </Button>
                                {/* <Button
                                    renderIcon={Rocket}
                                    onClick={() => updateBuild(item.version, "Prod")}
                                    disabled={productionVersion === item.version}>
                                    Mark as production
                                </Button> */}
                            </div>
                        </AccordionItem>
                    )}
                </Accordion>
            </>}

        {acitiveView === "status" && <>
            <BuildStatus templateId={template.id} template={template} setTemplate={setTemplate} />
        </>}
    </>);
}

export const templateVersionsLoader = async (id) => {
    const template = await axios.get(`/template/${id}`).then((res) => res.data)
    const templateVersions = await axios.get(`/template/version-control/${id}`).then((res) => res.data)
    return { template, templateVersions };
}
export default VersionControl;