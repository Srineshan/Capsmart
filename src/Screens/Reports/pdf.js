// import React from 'react';
// import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
// import TenetLogo from './../../images/Tenet_Health_logo.png';
// import TimeSmartLogo from './../../images/timeSmartAI-logo.png';

// const style = StyleSheet.create({
//   page: {
//     padding: 20
//   },
//   spaceBetween: {
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'space-between'
//   },
//   confidentialBoxStyle: {
//     border: '2px solid #F46044',
//     borderRadius: 7,
//     padding: 10,
//   },
//   confidentialTextStyle: {
//     fontSize: 17,
//     lineHeight: 20,
//     fontWeight: 'bold',
//     letterSpacing: 1.05,
//     color: '#F46044',
//   },
//   doNotDisturbTextStyle: {
//     fontSize: 12,
//     lineHeight: 20,
//     fontWeight: 600,
//     letterSpacing: 2.24,
//     color: '#F46044',
//     textTransform: 'capitalize',
//   },
//   headerLogo: {
//     width: 130,
//     height: 55,
//     objectFit: 'contain',
//   },
//   entityNameHeaderStyle: {
//     fontSize: 14,
//     lineHeight: 15,
//     fontWeight: 'bold',
//     letterSpacing: 0,
//     color: '#52575D',
//   },
//   reportRunByTextStyle: {
//     textAlign: 'left',
//     fontSize: 15,
//     lineHeight: 17,
//     fontWeight: 'medium',
//     letterSpacing: 0,
//     color: '#B3B8BD',
//   },
//   textAlignLeft: {
//     textAlign: 'left',
//   },
//   marginTop5: {
//     marginTop: 5,
//   },
//   headerBorderStyle: {
//     height: 1,
//     background: '#d7d4f7 0% 0% no-repeat padding-box',
//   },
//   marginTop40: {
//     marginTop: 40,
//   },
//   justifyCenter: {
//     display: 'flex',
//     justifyContent: 'center',
//   },
//   marginTop20: {
//     marginTop: 20,
//   },
//   grid5: {
//     display: 'grid',
//     gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
//     gridGap: 20,
//   },
//   grid4: {
//     display: 'grid',
//     gridTemplateColumns: '1fr 1fr 1fr 1fr',
//     gridGap: 20,
//   },
//   reportFooterLogo: {
//     width: 130,
//     height: 70,
//     objectFit: 'contain',
//   }
// });

// const PDFDocument = () => (
//     <>
//    <Document>
//     <Page size="A4" style={style.page}>
//         <View>
//             <View style={style.spaceBetween}>
//                 <View>
//                     <View style={style.confidentialBoxStyle}>
//                         <Text style={style.confidentialTextStyle}>CONFIDENTIAL</Text>
//                         <Text style={style.doNotDisturbTextStyle}>Do Not Distribute</Text>
//                     </View>
//                 </View>
//                 <View>
//                     <Image source={TenetLogo} alt="logo" style={style.headerLogo} />
//                     <Text style={style.entityNameHeaderStyle}>Tenet Healthcare System</Text>
//                 </View>
//                 <View>
//                     <Text style={style.reportRunByTextStyle}>Report run by : </Text>
//                     <View style={style.textAlignLeft}>
//                         <View style={style.marginTop5}>
//                             <Text style={style.entityNameHeaderStyle}>Peter Johnson at</Text>
//                         </View>
//                     </View>
//                     <View style={style.textAlignLeft}>
//                         <View style={style.marginTop5}>
//                             <Text style={style.entityNameHeaderStyle}>Jan 1 2022, 13:01</Text>
//                         </View>
//                     </View>
//                 </View>
//             </View>
//             <View style={style.headerBorderStyle}><View style={style.marginTop40}></View></View>
//         </View>
//         <View style={style.justifyCenter}>
//             <View style={style.marginTop20}>
//                 <View style={style.textAlignLeft}>
//                     <View style={style.marginTop5}>
//                         <Text style={style.entityNameHeaderStyle}>Activities/ Services Log Status Summary</Text>
//                     </View>
//                 </View>
//                 <View style={style.marginTop5}>
//                     <Text style={style.reportRunByTextStyle}>Reporting Period used for this report : Dec 2021</Text>
//                 </View>
//             </View>
//         </View>
//         <View style={style.mildBorderStyle}><View style={style.marginTop20}></View></View>
//         <View style={style.marginTop20}>
//             <View style={style.textAlignLeft}>
//                 <View style={style.marginTop5}>
//                     <Text style={style.entityNameHeaderStyle}>Reporting Parameters Applied</Text>
//                 </View>
//             </View>
//             <View style={style.marginTop20}>
//                 <View style={style.grid3}>
//                     <View>
//                         <View style={style.marginTop5}>
//                             <Text style={style.reportRunByTextStyle}>Service Site</Text>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Site 1, Site 2, Site 3</Text>
//                             </View>
//                         </View>
//                     </View>
//                     <View>
//                         <View style={style.marginTop5}>
//                             <Text style={style.reportRunByTextStyle}>Department/ Service Area</Text>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>All Departments</Text>
//                             </View>
//                         </View>
//                     </View>
//                     <View>
//                         <View style={style.marginTop5}>
//                             <Text style={style.reportRunByTextStyle}>Contracted Service Provider</Text>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Doctor 1, Doctor 2, Doctor 3</Text>
//                             </View>
//                         </View>
//                     </View>
//                 </View>
//             </View>
//             <View style={style.marginTop20}>
//                 <View style={style.grid3}>
//                     <View>
//                         <View style={style.marginTop5}>
//                             <Text style={style.reportRunByTextStyle}>Contracted Service/ Activity Category</Text>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Medical/ Surgical Care Services</Text>
//                             </View>
//                         </View>
//                     </View>
//                     <View>
//                         <View style={style.marginTop5}>
//                             <Text style={style.reportRunByTextStyle}>Type of Service/ Activity Performed</Text>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Medical/ Surgical Care Services</Text>
//                             </View>
//                         </View>
//                     </View>
//                     <View>
//                         <View style={style.marginTop5}>
//                             <Text style={style.reportRunByTextStyle}>Completion Status</Text>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Medical/ Surgical Care Services</Text>
//                             </View>
//                         </View>
//                     </View>
//                 </View>
//             </View>
//             <View style={style.mildBorderStyle}><View style={style.marginTop20}></View></View>
//             <View style={style.marginTop20}>
//                 <View style={style.textAlignLeft}>
//                     <View style={style.marginTop5}>
//                         <Text style={style.entityNameHeaderStyle}>Completed Activity / Service Log</Text>
//                     </View>
//                 </View>
//                 <View style={style.marginTop20}>
//                     <View style={style.grid5}>
//                         <View style={style.marginTop5}>
//                             <Text style={style.reportRunByTextStyle}>Activity/ Services</Text>
//                         </View>
//                         <View style={style.marginTop5}>
//                             <Text style={style.reportRunByTextStyle}>Scheduled Date/ Time</Text>
//                         </View>
//                         <View style={style.marginTop5}>
//                             <Text style={style.reportRunByTextStyle}>Completion Date/ Time</Text>
//                         </View>
//                         <View style={style.marginTop5}>
//                             <Text style={style.reportRunByTextStyle}>Contracted Provider</Text>
//                         </View>
//                         <View style={style.marginTop5}>
//                             <Text style={style.reportRunByTextStyle}>Site</Text>
//                         </View>
//                     </View>
//                 </View>
//                 <View style={style.marginTop20}>
//                     <View style={style.grid5}>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Fracture Clinic Session</Text>
//                             </View>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Jan 10 2022, 15:03</Text>
//                             </View>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Jan 10 2022, 16:45</Text>
//                             </View>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Abhi Gholap, DO</Text>
//                             </View>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Hospital 1</Text>
//                             </View>
//                         </View>
//                     </View>
//                 </View>
//                 <View style={style.marginTop20}>
//                     <View style={style.grid5}>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Fracture Clinic Session</Text>
//                             </View>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Jan 10 2022, 15:03</Text>
//                             </View>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Jan 10 2022, 16:45</Text>
//                             </View>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Abhi Gholap, DO</Text>
//                             </View>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Hospital 1</Text>
//                             </View>
//                         </View>
//                     </View>
//                 </View>
//                 <View style={style.marginTop20}>
//                     <View style={style.grid5}>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Fracture Clinic Session</Text>
//                             </View>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Jan 10 2022, 15:03</Text>
//                             </View>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Jan 10 2022, 16:45</Text>
//                             </View>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Abhi Gholap, DO</Text>
//                             </View>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Hospital 1</Text>
//                             </View>
//                         </View>
//                     </View>
//                 </View>
//             </View>
//             <View style={style.marginTop40}>
//                 <View style={style.textAlignLeft}>
//                     <View style={style.marginTop5}>
//                         <Text style={style.entityNameHeaderStyle}>To Do Activity/ Services</Text>
//                     </View>
//                 </View>
//                 <View style={style.marginTop20}>
//                     <View style={style.grid4}>
//                         <View style={style.marginTop5}>
//                             <Text style={style.reportRunByTextStyle}>Activity/ Services</Text>
//                         </View>
//                         <View style={style.marginTop5}>
//                             <Text style={style.reportRunByTextStyle}>Scheduled Date/ Time</Text>
//                         </View>
//                         <View style={style.marginTop5}>
//                             <Text style={style.reportRunByTextStyle}>Contracted Provider</Text>
//                         </View>
//                         <View style={style.marginTop5}>
//                             <Text style={style.reportRunByTextStyle}>Site</Text>
//                         </View>
//                     </View>
//                 </View>
//                 <View style={style.marginTop20}>
//                     <View style={style.grid4}>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Fracture Clinic Session</Text>
//                             </View>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Jan 10 2022, 15:03</Text>
//                             </View>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Abhi Gholap, DO</Text>
//                             </View>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Hospital 1</Text>
//                             </View>
//                         </View>
//                     </View>
//                 </View>
//                 <View style={style.marginTop20}>
//                     <View style={style.grid4}>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Fracture Clinic Session</Text>
//                             </View>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Jan 10 2022, 15:03</Text>
//                             </View>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Abhi Gholap, DO</Text>
//                             </View>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Hospital 1</Text>
//                             </View>
//                         </View>
//                     </View>
//                 </View>
//                 <View style={style.marginTop20}>
//                     <View style={style.grid4}>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Fracture Clinic Session</Text>
//                             </View>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Jan 10 2022, 15:03</Text>
//                             </View>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Abhi Gholap, DO</Text>
//                             </View>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Hospital 1</Text>
//                             </View>
//                         </View>
//                     </View>
//                 </View>
//             </View>
//             <View style={style.marginTop40}>
//                 <View style={style.textAlignLeft}>
//                     <View style={style.marginTop5}>
//                         <Text style={style.entityNameHeaderStyle}>Not Done Activity / Service Log</Text>
//                     </View>
//                 </View>
//                 <View style={style.marginTop20}>
//                     <View style={style.grid5}>
//                         <View style={style.marginTop5}>
//                             <Text style={style.reportRunByTextStyle}>Activity/ Services</Text>
//                         </View>
//                         <View style={style.marginTop5}>
//                             <Text style={style.reportRunByTextStyle}>Scheduled Date/ Time</Text>
//                         </View>
//                         <View style={style.marginTop5}>
//                             <Text style={style.reportRunByTextStyle}>Contracted Provider</Text>
//                         </View>
//                         <View style={style.marginTop5}>
//                             <Text style={style.reportRunByTextStyle}>Site</Text>
//                         </View>
//                         <View style={style.marginTop5}>
//                             <Text style={style.reportRunByTextStyle}>Reason Not Done</Text>
//                         </View>
//                     </View>
//                 </View>
//                 <View style={style.marginTop20}>
//                     <View style={style.grid5}>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Fracture Clinic Session</Text>
//                             </View>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Jan 10 2022, 15:03</Text>
//                             </View>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Abhi Gholap, DO</Text>
//                             </View>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Hospital 1</Text>
//                             </View>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Fracture Clinic Session</Text>
//                             </View>
//                         </View>
//                     </View>
//                 </View>
//                 <View style={style.marginTop20}>
//                     <View style={style.grid5}>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Fracture Clinic Session</Text>
//                             </View>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Jan 10 2022, 15:03</Text>
//                             </View>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Abhi Gholap, DO</Text>
//                             </View>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Hospital 1</Text>
//                             </View>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Fracture Clinic Session</Text>
//                             </View>
//                         </View>
//                     </View>
//                 </View>
//                 <View style={style.marginTop20}>
//                     <View style={style.grid5}>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Fracture Clinic Session</Text>
//                             </View>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Jan 10 2022, 15:03</Text>
//                             </View>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Abhi Gholap, DO</Text>
//                             </View>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Hospital 1</Text>
//                             </View>
//                         </View>
//                         <View style={style.textAlignLeft}>
//                             <View style={style.marginTop5}>
//                                 <Text style={style.reportTypeValueTextStyle}>Fracture Clinic Session</Text>
//                             </View>
//                         </View>
//                     </View>
//                 </View>
//             </View>
//         </View>
//         <View>
//             <View style={style.headerBorderStyle}><View style={style.marginTop40}></View></View>
//             <View style={style.spaceBetween}>
//                 <View>
//                     <Image source={TimeSmartLogo} alt="poweredBy" style={style.reportFooterLogo} />
//                 </View>
//                 <View style={style.marginTop20}>
//                     <Text style={style.reportFooterTextStyle}>Page 1 of 1</Text>
//                 </View>
//                 <View style={style.marginTop20}>
//                     <Text style={style.reportFooterTextStyle}>Copyright 2022, by TimeSmart.AI</Text>
//                     <Text style={style.reportFooterTextStyle}>All rights reserved</Text>
//                 </View>
//             </View>
//         </View>
//     </Page>
//   </Document>
//   </>
// );

// export default PDFDocument;
