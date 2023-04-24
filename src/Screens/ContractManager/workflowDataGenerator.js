export const workFlowDataGenerator = (workFlowName, workFlowData) => {
  console.log('name', workFlowName, workFlowData);
  let temp = {};
  for (const item of workFlowData) {
    temp[item?.step] = {
      "workFlowUser": {
        "id": item?.userId,
        "title": item?.userTitle,
        "name": {
          "name": item?.userName || '',
        },
        "suffix": {
          "id": item?.suffix?.id || '',
          "suffix": item?.suffix?.suffix || '',
        }
      },
      "workFlowStatus": {
        "status": item?.status
      }
    }
  }
  let data = {
    "name": {
      "name": workFlowName
    },
    "workFlowMap": {
      "workflow": temp
    }
  }
  return data;
}
