import { Add, Rocket } from "@carbon/icons-react";
import { Accordion, AccordionItem, Button, Tag, TextArea, TextInput, Tile } from "@carbon/react";
import axios from "axios";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";

const VersionControl = () => {
    const { template, templateVersions } = useLoaderData();
    const [newVersionName, setNewVersionName] = useState("");
    const [description, setDescription] = useState("");
    const [versions, setVersions] = useState(templateVersions);

    const [productionVersion, setProductionVersion] = useState(template.productionVersion);
    const [devVersion, setDevVersion] = useState(template.devVersion);


    const createVersion = () => {
        axios.post(`/template/version-control/${template.id}`, {
            version: newVersionName,
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
                if (type === "Prod") {
                    setProductionVersion(version)
                } else if (type === "Dev") {
                    setDevVersion(version)
                }
            }
        })


    return (<>
        <h4 style={{ marginBottom: "15px" }}>Template Source Control</h4>
        {/* <h3>{template.name}</h3> */}
        <Tile>
            <TextInput
                id="text-input-version-name"
                labelText="Version"
                value={newVersionName}
                onChange={(e) => {
                    setNewVersionName(e.target.value);
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
                <AccordionItem title={
                    <>{item.version}
                        {productionVersion === item.version &&
                            <Tag className="some-class" type="cyan">
                                {'Production'}
                            </Tag>}
                        {devVersion === item.version &&
                            <Tag className="some-class" type="gray">
                                {'Dev'}
                            </Tag>}
                    </>}>
                    <p>{item.description}</p>
                    <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                        <Button 
                            kind="secondary" 
                            onClick={() => updateBuild(item.version, "Dev")}
                            disabled={devVersion === item.version}>
                                Mark as dev
                        </Button>
                        <Button 
                            renderIcon={Rocket} 
                            onClick={() => updateBuild(item.version, "Prod")}
                            disabled={productionVersion === item.version}>
                                Mark as production
                        </Button>
                    </div>
                </AccordionItem>
            )}
        </Accordion>
    </>);
}

export const templateVersionsLoader = async (id) => {
    const templateVersions = await axios.get(`/template/version-control/${id}`).then((res) => res.data)
    const template = await axios.get(`/template/${id}`).then((res) => res.data)
    return { template, templateVersions };
}
export default VersionControl;