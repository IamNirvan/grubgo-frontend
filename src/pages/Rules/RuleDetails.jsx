import React, { useEffect, useState } from "react";
import { Typography, Button, Paper, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import MonacoEditor from "@monaco-editor/react";
import MainLayout from "../../layouts/MainLayout";
import useAxios from "../../util/useAxios";
import httpMethodTypes from "../../constants/httpMethodTypes";
import { toast } from "react-toastify";

const RuleDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { sendRequest } = useAxios();
  const [rule, setRule] = useState({
    id: 0,
    ruleName: "",
    factName: "",
    rule: "",
  });

  const fetchRuleById = async (id) => {
    const result = await sendRequest({
      url: `/v1/rules?id=${id}`,
      method: httpMethodTypes.GET,
    });

    setRule({
      id: result.data[0]?.id ?? "N/A",
      ruleName: result.data[0]?.ruleName ?? "N/A",
      factName: result.data[0]?.factName ?? "N/A",
      rule: result.data[0]?.rule ?? "N/A",
    });
  };

  const handleEditorChange = (value) => {
    setRule({ ...rule, rule: value });
  };

  const handleUpdate = async () => {
    await sendRequest({
      url: `/v1/rules`,
      method: httpMethodTypes.PUT,
      data: [
        {
          id: rule.id,
          ruleName: rule.ruleName,
          rule: rule.rule,
        },
      ],
    });
    toast.success("Rule updated successfully");
  };

  const handleDelete = async () => {
    const result = await sendRequest({
      url: `/v1/rules?ids=${id}`,
      method: httpMethodTypes.DELETE,
    });

    if (result.status === 200) {
      toast.success("Rule deleted successfully");
      navigate("/rules");
    } else {
      toast.error("Failed to delete rule");
    }
  };

  useEffect(() => {
    fetchRuleById(id);
  }, [id]);

  return (
    <MainLayout>
      <div className="font-[Poppins] p-[50px]">
        <h1 className="text-[30px] mb-[20px] font-bold">{`Rule #${id}`}</h1>
        <div>
          {/* Rule Name */}
          <TextField
            id="ruleName"
            label="Rule Name"
            name="ruleName"
            value={rule.ruleName}
            onChange={(e) => setRule({ ...rule, ruleName: e.target.value })}
            fullWidth
            margin="normal"
          />

          {/* Fact */}
          <TextField
            id="factName"
            label="Fact"
            name="factName"
            value={rule.factName}
            disabled
            fullWidth
            margin="normal"
          />

          {/* Monaco Editor */}
          <h1 className="text-[25px] mt-[20px] font-bold">Rule Definition</h1>
          <div
            style={{
              height: "400px",
              marginTop: "10px",
              border: "1px solid #c4c4c4", // Same as MUI input field border
              borderRadius: "4px", // Add rounded corners to match TextField
              overflow: "hidden", // Ensures the editor does not spill outside
            }}
          >
            <MonacoEditor
              height="100%"
              // language="javascript" // Syntax highlighting for the rule
              theme="vs-light" // Dark theme (can be 'light')
              value={rule.rule}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                wordWrap: "on",
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ marginTop: "20px" }}>
            <Button
              variant="contained"
              color="warning"
              onClick={handleUpdate}
              style={{ marginRight: "10px" }}
            >
              Update
            </Button>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RuleDetails;
