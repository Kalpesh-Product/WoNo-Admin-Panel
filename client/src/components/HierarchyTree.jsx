import React from "react";
import { Tree, TreeNode } from "react-organizational-chart";

const StyledNode = ({ children }) => {
  const style = {
    padding: "5px",
    borderRadius: "8px",
    display: "inline-block",
    border: "1px solid red",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
    width: "100px",
  };

  return <div style={style}>{children}</div>;
};

const HierarchyTree = () => {
  return (
    <div className="w-full">
      <div className="w-[70vw] h-[90vh] overflow-y-auto overflow-x-auto">
        <Tree
          lineWidth={"2px"}
          lineColor={"green"}
          lineBorderRadius={"10px"}
          label={<StyledNode>Root</StyledNode>}
        >
          <TreeNode label={<StyledNode>Kashif</StyledNode>}>
            <TreeNode label={<StyledNode>Kalpesh</StyledNode>}>
              <TreeNode label={<StyledNode>Aiwin</StyledNode>} />
              <TreeNode label={<StyledNode>Anushri</StyledNode>} />
              <TreeNode label={<StyledNode>Sankalp</StyledNode>} />
              <TreeNode label={<StyledNode>Allan</StyledNode>} />
              <TreeNode label={<StyledNode>Muskan</StyledNode>} />
            </TreeNode>
            <TreeNode label={<StyledNode>Mac</StyledNode>}>
              <TreeNode label={<StyledNode>Great Grand Child 1</StyledNode>} />
              <TreeNode label={<StyledNode>Great Grand Child 2</StyledNode>} />
              <TreeNode label={<StyledNode>Great Grand Child 1</StyledNode>} />
              <TreeNode label={<StyledNode>Great Grand Child 2</StyledNode>} />
              <TreeNode label={<StyledNode>Great Grand Child 1</StyledNode>} />
              <TreeNode label={<StyledNode>Great Grand Child 2</StyledNode>} />
              <TreeNode label={<StyledNode>Great Grand Child 1</StyledNode>} />
              <TreeNode label={<StyledNode>Great Grand Child 2</StyledNode>} />
              <TreeNode label={<StyledNode>Great Grand Child 1</StyledNode>} />
              <TreeNode label={<StyledNode>Great Grand Child 2</StyledNode>} />
              <TreeNode label={<StyledNode>Great Grand Child 1</StyledNode>} />
              <TreeNode label={<StyledNode>Great Grand Child 2</StyledNode>} />
            </TreeNode>
          </TreeNode>
          <TreeNode label={<StyledNode>HR</StyledNode>}>
          </TreeNode>
        </Tree>
      </div>
    </div>
  );
};

export default HierarchyTree;
