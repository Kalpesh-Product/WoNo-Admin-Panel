import React from "react";
import { Tree, TreeNode } from "react-organizational-chart";

const Access = () => {
  return (
    <Tree label={<div>Root</div>}>
      <TreeNode label={<div>Child 1</div>}>
        <TreeNode label={<div>Grand Child</div>} />
      </TreeNode>
      <TreeNode label={<div>Child 2</div>}>
        <TreeNode label={<div>Grand Child</div>} />
      </TreeNode>
      <TreeNode label={<div>Child 3</div>}>
        <TreeNode label={<div>Grand Child</div>} />
      </TreeNode>
    </Tree>
  );
};

export default Access;
