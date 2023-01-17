export const workFlowDataGenerator = (workFlowName, workFlowData) => {
  console.log('name', workFlowName);
  let temp = {};
  for (const item of workFlowData) {
    temp[item?.step] = {
      "workFlowUser": {
        "id": item?.userId,
        "title": {
          "title": item?.title?.title || '',
          "id": item?.title?.id || '',
        },
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
