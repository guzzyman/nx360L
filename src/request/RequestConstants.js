export const RequestStatusColorEnum = {
  open: "warning",
  resolved: "success",
  "pending feedback": "warning",
  "feedback provided": "info",
  closed: "success",
  "re-open": "warning",
  "in draft": "success",
};
export const filterStatus = [
  {
    id: "open",
    statusDescription: "Open",
  },
  {
    id: "resolved",
    statusDescription: "Resolved",
  },
  {
    id: "pending feedback",
    statusDescription: "Pending feedback",
  },
  {
    id: "closed",
    statusDescription: "Closed",
  },
  {
    id: "feedback provided",
    statusDescription: "Feedback provided",
  },
  {
    id: "re-open",
    statusDescription: "Re-open",
  },
  {
    id: "in draft",
    statusDescription: "In draft",
  },
];

export const EMAIL_RESPONSE_TEMPLATE = [
  {
    category: `New Email from an existing customer on an issue`,
    opening: `<p>Dear ****,</p>`,
    closing: `<p>We appreciate your patronage and assure you of our commitment to excellent service delivery. 
    </p><br><br><p>Thank you for contacting Credit Direct Limited.</p><br><br><p> Best regards</p>`,
  },
  {
    category: `Second contact from an existing customer on a different query`,
    opening: `<p>Dear ****,</p>`,
    closing: `<p>Once again, we thank you for giving us an opportunity to be of service to you. </p><br><br><p>Thank you for choosing Credit Direct Limited.</p><br><br><p>
    Best regards,</p>`,
  },
  {
    category: `Second contact from an existing customer on the same issue (usually an unresolved complaint)`,
    opening: `<p>Dear ****,</p>`,
    closing: `<p>Once again, we thank you for giving us an opportunity to be of service to you. </p>
    <p>We apologize for the delayed resolution of your complaint on ……  We appreciate your patience and understanding, thank you for doing business with us.</p>
    <p>Best regards,</p>`,
  },
  {
    category: `Third contact from an existing customer on the same issue (usually an unresolved complaint)`,
    opening: `<p>Dear ****,</p>`,
    closing: `<p>We acknowledge receipt of your email and understand the situation. </p>
    <p>Please accept our unreserved apology as the delay in resolving your compliant on **** was due to ****, we assure you ****  Once again, we apologise for the inconveniences caused and thank you for doing business with us.</p>
    <p>Best regards,</p>`,
  },
  {
    category: `Follow-up email `,
    opening: `<p>Dear ****,</p>`,
    closing: `<p>Further to our previous correspondence on *******, please *****</p>
    <p>We appreciate the opportunity given to us to be of service to you.</p>
    <p>Best regards,</p>`,
  },
  {
    category: `Customer sends back information/attachment we had previously requested`,
    opening: `<p>Dear ****,</p>`,
    closing: `<p>We acknowledge receipt of your attachment or We acknowledge receipt of the details provided</p>
    <p>We appreciate your patronage and assure you of our commitment to excellent service delivery.</p>
    <p>Best regards,</p>`,
  },
  {
    category: `Enquiries from Prospects (Lead)`,
    opening: `<p>Dear ****,</p>`,
    closing: `<p>Thank you for contacting Credit Direct Limited, we appreciate your interest in our product offerings. </p>
    <p>We look forward to doing business with you.</p>
    <p>Best regards,</p>`,
  },
  {
    category: `Customers who require renewal loans`,
    opening: `<p>
      Dear Mr./Mrs./Miss…..xxxx,  </p><br><br><p>We appreciate your interest in our product offerings.</p><br><br><p>Following your request for a federal renewal loan, we are sorry to inform you that our loans to Federal government employees have been temporarily halted due to a delay in the remittance of due repayments. We would resume lending to you once the accrued repayments are received from your employer.</p><br><br><p>Our loans to State Government employees are still available. As such, your family and friends who work for the State Government can still access quick loans from Credit Direct Limited. </p><br><br><p>Please rest assured that we would contact you as soon as the service is restored.</p><br><br><p>We sincerely regret the inconvenience this may cause you and once again, thank you for choosing Credit Direct Limited. Do stay Safe.</p><br><br><p>Best Regards,
      </p>`,
    closing: `<p></p>`,
  },
  {
    category: `Customers who require new loans`,
    opening: `<p>Dear Mr./Mrs./Miss…..xxxx,</p><br><br><p>Thank you for contacting Credit Direct Limited.</p><br><br><p>We appreciate your interest in our product offerings.</p><br><br><p>Following your request for a new federal loan, we are sorry to inform you that our loans to Federal government employees have been temporarily halted to enable some structural realignments in the repayment process.  </p><br><br><p>Please rest assured that we would contact you as soon as the service is restored.</p><br><br><p>Kindly note that loans to State Government employees are still available. As such, your family and friends who work for the State Government can access quick loans from Credit Direct Limited. </p><br><br><p>We sincerely regret the inconvenience this may cause you and once again, thank you for choosing Credit Direct Limited. Do stay Safe.</p><br><br><p>Best regards,</p><br><br><p></p>`,
    closing: `<p></p>`,
  },
  {
    category: `Customers whose loans have been completed but are still being deducted`,
    opening: `<p>Dear Mr./Mrs./Miss….xxxx,</p><br><br><p>Thank you for the opportunity to be of service to you.</p><br><br><p>We received your complaint on the non-stoppage of your monthly repayment deductions and are saddened about its occurrence. </p><br><br><p>Your loan repayment to Credit Direct Limited is complete and deductions on your account should have been stopped, however, you are still being debited by your employer and we are working asidously to ensure that the deductions on your account are discontinued. </p><br><br><p>Please note that the subsequent deductions made on your account by your employer have not been remited to us yet. This implies that Credit Direct Limited is currently not in possession of the funds deducted from your account. </p><br><br><p>However, be assured that we would continue to work with your employer to ensure that the deductions on your account are stopped and funds due to you are refunded. </p><br><br><p>We sincerely regret the inconvenience this may have caused you and appreciate your understanding.</p><br><br><p>Once again, thank you for choosing Credit Direct Limited, do stay safe.</p><br><br><p>Best Regards,</p>`,
    closing: `<p></p>`,
  },
  {
    category: `Customers whose loans should have been completed but are still active because remittances have not been made`,
    opening: `<p>Dear Mr./Mrs./Miss….xxxx,</p><br><br><p>Thank you for the opportunity to be of service to you.</p><br><br><p>Regarding your complaint on the non-stoppage of your monthly deductions and the non-closure of your loan account which should have been completed since “XXX 2021”, we are aware your loan account is still active because your employer has not remitted your last “three” repayments to Credit Direct Limited. </p><br><br><p>We are deeply sorry that you experienced this inconvenience. </p><br><br><p>Eventually, your repayment would be remitted to us by your employer; in the interim, you can make cash payment into our account with the details stated below to enable us reconcile and close your loan account. Please be assured that if you make a cash payment now, we would immediately refund your repayment into your account once we receive same from your employer. </p><br><br><p>•\tAccount Name: Credit Direct Limited</p><br><br><p>•\tAccount No: 0238850014</p><br><br><p>•\tBank: FCMB</p><br><br><p>•\tCustomer ID:</p><br><br><p>Kindly enter your full name and Customer ID in the narration section while making payment (via transfer or bank deposit) for proper identification. </p><br><br><p>We would continue to work with your employer to ensure that the deductions on your account are stopped and funds due to you are refunded.</p><br><br><p>Thank you for your understanding and thank you for choosing Credit Direct Limited, do stay safe.</p><br><br><p>Best regards,</p><br><br><p></p>`,
    closing: `<p></p>`,
  },
  {
    category: `Customers who are due for a refund`,
    opening: `<p>Dear Mr./Mrs./Miss……xxxx,</p><br><br><p>Thank you for contacting Credit Direct Limted.</p><br><br><p>Please be informed that you are due for  xxxx (enter month and year) deduction refund, however; we are unable to process your refund as we await remittance of the repayment from your employer.</p><br><br><p>We sincerely apologize for the inconvenience this may have caused and assure you that your account would be credited with NXXX amount (enter refund amount) as soon as we receive the relevant funds. </p><br><br><p>Once again, we thank you for choosing Credit Direct Limited, do stay safe.</p><br><br><p>Best regards,</p>`,
    closing: `<p></p>`,
  },
  {
    category: `C2G Loan Enquiry`,
    opening: `<p>Dear Mr. /Mrs. /Miss….XXXX</p><br><br><p>Thank you for contacting Credit Direct Limited.</p><br><br><p>We appreciate your interest in our product offerings.</p><br><br><p>Our loans are currently available to Federal and State Government workers, we are working on resuming lending to Private Sector employees. This implies that we would be unable to avail a loan facility to you for now until the private sector lending service is restored.</p><br><br><p>We sincerely regret the inconvenience this may cause, please be assured that you will be notified as soon as we resume lending to private sector employees.</p><br><br><p>Once again, we thank you for choosing Credit Direct Limited, do stay safe.</p><br><br><p>Best Regards,</p><br><br><p></p>`,
    closing: `<p></p>`,
  },
  {
    category: `Complaint on High interest rate`,
    opening: `<p>
      Your feedback has been noted and we appreciate your sharing it with us.</p><br><br><p>We value your opinion and will consider your concerns towards improving our service. The following however are some important points to note about our current product offering;</p><br><br><p>\tCredit Direct rates are competitive especially because there are no hidden charges</p><br><br><p>\tCredit Direct does not charge pre-liquidation fees so there is no extra charge if you pay up your facility before the expiration of the loan period</p><br><br><p>\tYou get the extra benefit of an insurance package when you take a Credit Direct Loan</p><br><br><p>Please be assured that our customers’ satisfaction is of utmost importance to us and we will continue to work with your feedback to improve our processes.</p><br><br><p>
      </p>`,
    closing: `<p></p>`,
  },
  {
    category: `Downtime Holding Template`,
    opening: `<p>
      Dear XXXX,</p><br><br><p>Thank you for contacting Credit Direct Limited.</p><br><br><p>Further to your email below, please be informed that we are experiencing a temporal downtime on our system and as such, we are unable to respond appropriately now.</p><br><br><p>Rest assured that all efforts are in place to ensure that our systems are back up soonest, we will provide feedback afterwards.  </p><br><br><p>All inconveniences caused by this experience are deeply regretted, thank you for your understanding.</p><br><br><p>Best regards,</p><br><br><p>
      </p>`,
    closing: `<p></p>`,
  },
  {
    category: `Authentication Template`,
    opening: `<p>
      Following your service request for xxxxxxx, please provide the information below to enable us confirm the authenticity of your request and treat.</p><br><br><p> </p><br><br><p>•\tEnter authentication questions based on the authentication process document</p><br><br><p>•\tNote: For all balance enquiry requests, please include this question (To ensure that we continually improve on our service delivery and meet your expectations, we leverage every opportunity to hear from you. Could you please confirm the reason for your balance request, Would you like to settle your loan? Apply for a top-up or other reasons? kindly indicate accordingly )</p><br><br><p>•\tFor payment confirmation & settlement requests, in addition to the authentication questions, ask this: (We would also appreciate your feedback on the reason you are settling your loan after xxx repayments. This information would help us improve on our service delivery, where necessary. ), </p><br><br><p>Please be assured that as soon as we receive your response, we would proceed to treat your request accordingly. </p><br><br><p>OR</p><br><br><p>Please note that based on our policy on confidentiality, we would be requiring some details for authentication from you.</p><br><br><p>Kindly provide us with the details below to enable us attend to your request on xxxxx: </p><br><br><p>•\tEnter authentication questions based on the authentication process document</p><br><br><p>•\tNote: For all balance enquiry requests, please include this question (To ensure that we continually improve on our service delivery and meet your expectations, we leverage every opportunity to hear from you. Could you please confirm the reason for your balance request, Would you like to settle your loan? Apply for a top-up or other reasons? kindly indicate accordingly </p><br><br><p>•\tFor payment confirmation & settlement requests, in addition to the authentication questions, ask this: (We would also appreciate your feedback on the reason you are settling your loan after xxx repayments. This information would help us improve on our service delivery, where necessary. )</p><br><br><p>Looking forward to your feedback to advise you appropriately.</p><br><br><p>We appreciate your patronage and remain your trusted financial partner. Keep staying safe.</p><br><br><p>Service Requests that require authentication: Balance request, Account Information Update, Cheque Deferment/extraction Request, Credit Report Request, Insurance – requests, Interest Waiver Appeal, Letters (indebtedness and non-indebtedness), Loan cancellation, Loan Refinancing/Restructuring, Loan Repayment Extension, Loan Settlement Request, Mandate Requests (activation/deactivation), Payment Reconciliation, Repayment details request (date, amount etc.) and USSD requests.</p><br><br><p>
      </p>`,
    closing: `<p></p>`,
  },
  {
    category: `Downtime Holding Template for delayed responses`,
    opening: `<p>
      Dear XXXX,</p><br><br><p>Thank you for contacting Credit Direct Limited.</p><br><br><p>Further to your request for liquidation balance, kindly accept our apologies for the delay in responding.</p><br><br><p>Due to a technical glitch within our system, we are currently unable to avail the requested balance, however, all efforts are in place to resolve this as soon as possible.</p><br><br><p>Please be assured that your liquidation balance would be sent to you once our systems are back up.</p><br><br><p>We appreciate your understanding and look forward to serving you soonest.</p><br><br><p>Best regards,</p><br><br><p>
      </p>`,
    closing: `<p></p>`,
  },
  {
    category: `Liquidation Balance request for C2G`,
    opening: `<p>Following your request for liquidation balance, please find below Credit Direct bank details and your settlement balance as at date:</p><br><br><p>      Account Name: Credit Direct Limited</p><br><br><p>      Account No: 0238850083</p><br><br><p>      Bank: FCMB</p><br><br><p>      Settlement balance: N*****</p><br><br><p>      Your Customer ID: </p><br><br><p>Kindly be informed that the above settlement balance is valid till May 31st, 2019 after which a full month's interest will apply at the beginning of every month until payment is completed.</p><br><br><p>We implore you to enter your details such as; name, your Customer ID etc. for all payments including payments made via transfer for proper identification.</p><br><br><p>Please also notify us via email or call on 01-4482225 as soon as payment is made in order to settle your loan account accordingly.</p><br><br><p></p>`,
    closing: `<p></p>`,
  },
  {
    category: `Liquidation Balance request  (Federal)`,
    opening: `<p>Following your request for liquidation balance, please find below Credit Direct bank details and your settlement balance as at date:</p><br><br><p>      Account Name: Credit Direct Limited</p><br><br><p>      Account No: 0238850014</p><br><br><p>      Bank: FCMB</p><br><br><p>      Settlement balance: N*****</p><br><br><p>Kindly be informed that the above settlement balance is valid till May 31st, 2019 after which a full month's interest will apply at the beginning of every month until payment is completed.</p><br><br><p>We implore you to enter your details such as; name, your Employee Number etc. for all payments including payments made via transfer for proper identification.</p><br><br><p>Please note that payment can also be made via NIBBS Ebills or POS and evidence of payment sent to resolutionsteam@creditdirect.ng or any nearest Credit Direct Outlet.</p><br><br><p>Kindly also notify us via email or call on 01-4482225 as soon as payment is made in order to settle your loan account accordingly.</p><br><br><p></p>`,
    closing: `<p></p>`,
  },
  {
    category: `Liquidation Balance request  (ETC)`,
    opening: `<p>Following your request for liquidation balance, please find below Credit Direct bank details and your settlement balance as at date:</p><br><br><p>      Account Name: Credit Direct Limited</p><br><br><p>      Account No: 0238850605</p><br><br><p>      Bank: FCMB</p><br><br><p>      Settlement balance: N*****</p><br><br><p>      Your Customer ID: </p><br><br><p>Kindly be informed that the above settlement balance is valid till May 31st, 2019 after which a full month's interest will apply at the beginning of every month until payment is completed.</p><br><br><p>We implore you to enter your details such as; name, your Customer ID etc. for all payments including payments made via transfer for proper identification.</p><br><br><p>Please also notify us via email or call on 01-4482225 as soon as payment is made in order to settle your loan account accordingly.</p><br><br><p></p>`,
    closing: `<p></p>`,
  },
  {
    category: `Balance request  (not indicated whether liquidation or expected balance)`,
    opening: `<p>Following your request for loan balance, please find below your expected and settlement balances.</p><br><br><p>·         Settlement Balance: N xxxx (if you intend to liquidate/settle before the end of this month)</p><br><br><p>·         Expected Balance:  N xxxx (your outstanding balance until expiration of loan tenor)</p><br><br><p>If you wish to liquidate/settle your loan before the end of this month, please find below the Credit Direct bank details, kindly endeavor to fully liquidate to enable us close-out your loan account:</p><br><br><p>      Account Name: Credit Direct Limited</p><br><br><p>      Account No: 0238850605</p><br><br><p>      Bank: FCMB</p><br><br><p>      Settlement balance: N*****</p><br><br><p>      Your Customer ID: </p><br><br><p>Please be informed that the above settlement balance is valid till July 31st, 2019 after which a full month's interest will apply at the beginning of every month until payment is completed.</p><br><br><p>We implore you to enter your details such as; name, your Customer ID etc. for all payments including payments made via transfer for proper identification.</p><br><br><p>Please also notify us via email or call on 01-4482225 as soon as payment is made in order to settle your loan account accordingly</p><br><br><p></p>`,
    closing: `<p></p>`,
  },
  {
    category: `Letter of non-indebtedness`,
    opening: `<p>We appreciate your patronage and confirm that your loan account has been fully settled. </p><br><br><p>Further to your request for a Letter of Non-indebtedness, please note that a payment of N500; being cost of processing is required. Kindly credit our FCMB Account 0238850083 accordingly to enable us process your request. </p><br><br><p>Please notify us once the payment is made for immediate processing.</p><br><br><p> </p><br><br><p>All inconveniences caused are regretted.  </p><br><br><p>When the N500 payment is made</p><br><br><p>We acknowledge receipt of your feedback and payment of N500 for the Letter of Non-Indebtedness. </p><br><br><p>Please find attached a duly signed Letter of Non-indebtedness for your attention. </p><br><br><p>Once again, we thank you for doing business with Credit Direct and look forward to more collaborations with you. </p><br><br><p></p>`,
    closing: `<p></p>`,
  },
  {
    category: `Loan account settled/payment confirmed`,
    opening: `<p>We acknowledge receipt of your feedback and appreciate the timely repayment.</p><br><br><p>Please be informed that your payment of N**** has been confirmed and the loan account settled (closed). </p><br><br><p></p>`,
    closing: `<p></p>`,
  },
  {
    category: `Customer Informs us that Loan account has been settled by a Buy-over company `,
    opening: `<p>We acknowledge receipt of your email on loan settlement.</p><br><br><p>Please be informed that the payment of N**** has been confirmed and your loan account settled (closed). </p><br><br><p>Your feedback is important to us, kindly let us know how we have served you and the areas you would like us to improve on. </p><br><br><p></p>`,
    closing: `<p></p>`,
  },
  {
    category: `Complaint on payment not confirmed and loan account not settled`,
    opening: `<p>We regret all inconveniences you may have experienced. </p><br><br><p>Your loan account is still active because we are yet to confirm your payment of N *** as stated in your email. </p><br><br><p>We kindly request that you provide an evidence of payment to enable us confirm and regularize your loan account.</p><br><br><p>Once again, all inconveniences caused are regretted.</p><br><br><p></p>`,
    closing: `<p></p>`,
  },
  {
    category: `Cheque Rescheduling`,
    opening: `<p>Following your request to reschedule your cheque presentation, we are pleased to inform you that it has been treated. </p><br><br><p>Consequently, your cheque presentation for the month of *** has been rescheduled to **** 1st, 2019. </p><br><br><p>Please ensure that your account is duly funded on the stated date to avoid returned cheque penalties. We also advise that you do not pay cash.</p><br><br><p></p>`,
    closing: `<p></p>`,
  },
  {
    category: `Confirmation of Ddm Deactivation`,
    opening: `<p>Further to your enquiry on the status of your Remita Mandate deactivation request, we are pleased to inform you that your Remita Mandate with reference number ***** has been deactivated following complete settlement (repayment). </p><br><br><p>This implies that further deductions are not expected to happen on the above stated mandate as it has been closed.</p><br><br><p>For enquiries, please send us an email or call 014482225 (our business hours are from 8am to 5pm, Mondays through Fridays). You can also chat with us via our website www.creditdirect.ng or WhatsApp 09070309430.</p><br><br><p></p>`,
    closing: `<p></p>`,
  },
  {
    category: `Refund complaint from PSB (when schedule has not been received) `,
    opening: `<p>We acknowledge receipt of your complaint on excess deduction for the month of ***** and apologize for the inconvenience you have experienced.</p><br><br><p> </p><br><br><p>Please be informed that we are yet to receive the excess repayment amount from your employer to enable us validate your claim. </p><br><br><p>However, we assure you that your complaint has been noted and once we receive the excess payment for December from your employer, a refund would be immediately processed, and your account credited with the excess repayment value. </p><br><br><p></p>`,
    closing: `<p></p>`,
  },
  {
    category: `Request receiving attention `,
    opening: `<p>Your request for ***** is currently receiving the required attention, and feedback will be provided within 24 working hours. </p><br><br><p>·         Your request for ***** is currently receiving the required attention, an update will be provided within 24 working hours.</p><br><br><p></p>`,
    closing: `<p></p>`,
  },
  {
    category: `Complaint receiving attention`,
    opening: `<p>We acknowledge receipt of your complaint on *** and sincerely regret the inconvenience caused by this experience.</p><br><br><p>Please be assured that it is receiving the required attention and feedback will be provided within 24 working hours. </p><br><br><p>·         We acknowledge receipt of your complaint on *** and sincerely regret the inconvenience caused by this experience.</p><br><br><p>Please be assured that all efforts are in place to resolve it as soon as possible. We will provide feedback within 24 working hours. </p>`,
    closing: `<p></p>`,
  },
  {
    category: `Refund complaint delayed due to delayed credit from Remita`,
    opening: `<p>We acknowledge receipt of your complaint on delayed refund and apologize for the inconvenience caused.</p><br><br><p>A refund would be processed to your account once the excess deduction of N**** has been confirmed. We implore you to send us an evidence of the deduction from your account (if available) as it would aid our investigation and hasten the process. </p><br><br><p></p>`,
    closing: `<p></p>`,
  },
  {
    category: `Customer wants to know why he/she was debited after paying cash `,
    opening: `<p>Please accept our sincere apologies for the inconvenience you must have experienced. </p><br><br><p>The electronic repayment platform (Direct Debit Mandate) is currently unable to automatically detect cash repayments, however, if you make a cash payment one week before your repayment due date and notify us immediately, we would update our records and avert an automated debit on your account. </p><br><br><p>Please be assured that a refund would be processed to your account once the excess deduction of N**** has been confirmed. We implore you to send us an evidence of the deduction from your account (if available) as it would aid our investigation and hasten the process. </p><br><br><p></p>`,
    closing: `<p></p>`,
  },
  {
    category: `Made incomplete payment `,
    opening: `<p>We acknowledge receipt of your feedback on the repayment of N***** and appreciate your commitment to servicing your loan.</p><br><br><p>However, please note that your loan account would remain active as the payment you made is less than your liquidation balance as at December 1st which is N****.</p><br><br><p>We advise that you pay-up the balance(N…) and notify us immediately to enable us close your loan account. Kindly note that the above stated liquidation balance is valid till the end of this month as new interest would accrue if the loan account is unresolved by the first day of a new month.</p><br><br><p>Thank you for your understanding.</p><br><br><p></p>`,
    closing: `<p></p>`,
  },
  {
    category: `Loan has been settled/Letter of Non-Indebtedness `,
    opening: `<p>We are happy to confirm that your loan has been repaid and fully settled. This implies that you are no longer indebted to Credit Direct.</p><br><br><p>As requested, please find attached a letter of Non-Indebtedness to this effect. </p><br><br><p>Kindly send us an email, chat with us or call us on 014485552 to do more business.  </p><br><br><p></p>`,
    closing: `<p></p>`,
  },
  {
    category: `Refund complaint resolved `,
    opening: `<p>Further to our previous correspondence stating that a refund is being processed for you, we are pleased to inform you that the complaint has been resolved and your account credited with N*****. </p><br><br><p>Kindly check your account statement to confirm receipt of the credit. </p><br><br><p>Once again, all inconveniences caused are regretted. </p>`,
    closing: `<p></p>`,
  },
  {
    category: `Complaint on cheque being presented after paying cash `,
    opening: `<p>We regret all inconveniences caused by this experience. </p><br><br><p>Our investigation reveals that your cheque instrument was presented on February 19, 2019, which was a day before your due date and was sent for clearing the following day. This indicates that we had presented the cheque before your cash repayment was done on February 20, 2019. </p><br><br><p>To avert a reoccurrence, we advise that you make cash payments latest 48 hours to your due date and notify us to retract your cheque after confirming the payment. Alternatively, you could fund your account to enable the cheque go through when presented. </p><br><br><p>Please be assured that we have taken note of your refund complaint and would credit your account with the duplicated amount when we confirm receipt of your cash payment. </p><br><br><p>Once again, all inconveniences caused are deeply regretted.</p><br><br><p></p>`,
    closing: `<p></p>`,
  },
  {
    category: `Request to released Unused Cheque `,
    opening: `<p>We acknowledge receipt of your request to release the unused cheque instruments however, for security reasons, unused instruments are perforated.</p><br><br><p>All inconveniences caused are regretted.</p><br><br><p></p>`,
    closing: `<p></p>`,
  },
  {
    category: `Removal of lien on account`,
    opening: `<p>Further to your request to lift the lien on your account, we are pleased to inform you that it has been done after confirmation of your payment. </p><br><br><p>For further enquiries, please send us an email or call 014482225 (our business hours are from 8am to 5pm, Mondays through Fridays). You can also chat with us via our website www.creditdirect.ng or WhatsApp 09070309430.</p><br><br><p>All inconveniences caused are regretted.</p><br><br><p></p>`,
    closing: `<p></p>`,
  },
  {
    category: `Payment confirmed `,
    opening: `<p>Your payment of N***** has been confirmed and your account reconciled accordingly. This implies that your repayment for the month of ******* has been settled. </p><br><br><p>We appreciate your timely repayment and partnership. </p><br><br><p>Repayment confirmed/Cheque extracted</p><br><br><p>Your payment of N**** has been confirmed and your cheque for the month of ********** extracted accordingly. </p><br><br><p>We appreciate your timely repayment and partnership.</p>`,
    closing: `<p></p>`,
  },
  {
    category: `Repayment confirmed/Cheque extracted`,
    opening: `<p>Your payment of N**** has been confirmed and your cheque for the month of ********** extracted accordingly. </p><br><br><p>We appreciate your timely repayment and partnership.</p><br><br><p></p>`,
    closing: `<p></p>`,
  },
  {
    category: `Do not present my cheque `,
    opening: `<p>Following your request, please be informed that we have halted the presentation of your cheque for the month of (N****) after confirming your cash payment.</p><br><br><p>We advise that you notify us 48 hours before the cheque presentation due date whenever you make repayments before your due date; this is to ensure that the instrument is not presented for clearing.</p><br><br><p>If its too late to stop cheque </p><br><br><p>We acknowledge receipt of your request to stop the presentation of your cheque for the month of ****** however, we are unable to stop it as the cheque has already been presented for clearing. </p><br><br><p>All inconveniences caused are deeply regretted, please ensure that your account is duly funded with the repayment value (N****) to avoid returned cheque charges. If you have made a cash payment, please forward your evidence of payment to us to process a refund. </p><br><br><p>We also advise that subsequently, you notify us 48 hours before the repayment due date whenever you make repayments before your due date; this is to ensure that the instrument is not presented for clearing. </p><br><br><p></p>`,
    closing: `<p></p>`,
  },
  {
    category: `Reschedule cheque presentation `,
    opening: `<p>Following your request, please be informed that we have rescheduled the presentation of your cheque from ****** to ******. Kindly ensure that your account is duly funded with the repayment amount (N****) to avoid returned cheque charges. </p><br><br><p>Please do not pay CASH before the new cheque presentation date as the instrument would be presented on the communicated date.</p><br><br><p>If it’s too late to reschedule cheque </p><br><br><p>We acknowledge receipt of your request to reschedule the presentation of your cheque instrument for the month of ****** however, we are unable to treat as the cheque has already been presented for clearing. </p><br><br><p>All inconveniences caused are deeply regretted, please ensure that your account is duly funded with the repayment value (N****) to avoid returned cheque charges.</p><br><br><p>We also advise that subsequently, you notify us 48 hours before the repayment due date whenever you need to adjust your repayment pattern. </p><br><br><p></p>`,
    closing: `<p></p>`,
  },
  {
    category: `Request to hold on to cheque for too long `,
    opening: `<p>Your request to further halt the presentation of your cheque has been duly considered; however, we are unable to continually hold on to the instrument as it has exceeded the approved hold period.</p><br><br><p>Hence, your March cheque instrument of N*** has been scheduled for presentation on *****. We sincerely regret all inconveniences this may cause you and advise that you fund your account to accommodate the repayment amount and avoid returned cheque charges. </p><br><br><p>Please do not pay Cash before the new cheque presentation date as the instrument would be presented on the communicated date.</p><br><br><p></p>`,
    closing: `<p></p>`,
  },
  {
    category: `Loan account closed `,
    opening: `<p>We appreciate your prompt loan settlement. </p><br><br><p>After due confirmation of your N***** repayment, your loan account has been settled and closed.</p><br><br><p>We would like to do more business with you in the nearest future, please do not hesitate to contact us if you need another facility.</p><br><br><p></p>`,
    closing: `<p></p>`,
  },
  {
    category: `Remita Swept account after cash payment `,
    opening: `<p>We apologise for the inconvenience caused by this experience.</p><br><br><p>Although your cash payment of N**** was confirmed on *****, your account was still debited by Remita for the same repayment because the deduction had been pre-scheduled before your payment was received. </p><br><br><p>Please however note that we would immediately investigate this and refund the excess deduction into your account within ****** after due confirmation.</p><br><br><p></p>`,
    closing: `<p></p>`,
  },
  {
    category: `Lead `,
    opening: `<p>Our Sales Executive in (Kaduna) would contact you shortly for further discussions. </p>`,
    closing: `<p></p>`,
  },
  {
    category: `Enquiry on Products-C2G`,
    opening: `<p>Our Cash to Go (C2G) product is designed for salaried employees in the Private Sector.  We provide unsecured loans to salary earners without asking for collateral, guarantor or rigorous documentations and it is accessible in few hours of providing complete documentation.</p><br><br><p>Here are some of its features:</p><br><br><p>1.       Quick convenient loans up to N 5 million </p><br><br><p>2.      Minimum loan amount that can be availed is N100,000</p><br><br><p>3.       Not more than 18 Months repayment plan (terms and conditions apply)</p><br><br><p>4.      Insurance on all Loans</p><br><br><p>To access this facility, we require the following:</p><br><br><p>1.       1 Passport photograph</p><br><br><p>2.      Your work Identity Card</p><br><br><p>3.       Your employment, Confirmation or Last Salary Review Letter</p><br><br><p>4.      6 months Bank Statement (3 Months Recent Payslip if salary is not regular)</p><br><br><p>5.      Postdated Cheques Covering the Loan Tenor or an activated direct debit mandate and</p><br><br><p>6.      Bank Verification Number</p><br><br><p>If you are interested in obtaining this facility, please visit www.creditdirect.ng; it is a self-service online application process, once you apply, a representative would contact you. </p><br><br><p>Alternatively, you can respond to this email with your name, phone number and location, we will contact you for further discussions. You can also call our Contact Centre on 014482225 (business hours are from 8am to 5pm, Mondays through Fridays).</p><br><br><p></p>`,
    closing: `<p></p>`,
  },
  {
    category: `Enquiry on Products- ETC`,
    opening: `<p>Our ETC (Empower the Corps) Product is designed to provide quick loans to corps members who wish to start-up small businesses, gain professional certifications and sort out other financial needs while serving the nation.</p><br><br><p>Some of its features are: </p><br><br><p>1.       No collateral or guarantor required</p><br><br><p>2.      Seamless online application process</p><br><br><p>3.       Free life and Hospitalization insurance cover throughout the duration of the loan</p><br><br><p>4.      N5,000 minimum loan amount</p><br><br><p>Requirements to be uploaded online</p><br><br><p>1.       Bank Verification Number</p><br><br><p>2.      Photo of NYSC Identity card or NYSC relocation approval letter</p><br><br><p>3.       Photo of attestation letter from SAED </p><br><br><p>4.      Passport photograph showing Corps member’s face and shoulders only</p><br><br><p>5.      Photo of Corps member wearing full NYSC regalia</p><br><br><p>6.      NYSC account number</p><br><br><p>7.       Photo of completed letter of undertaking clearly signed and dated by corps member</p><br><br><p>8.      Primary place of assignment posting letter </p><br><br><p>If you are interested in obtaining this facility, please visit www.creditdirect.ng; it is a self-service online application process, once you apply, a representative would contact you. </p><br><br><p>Alternatively, you can respond to this email with your name, phone number and location, we will contact you for further discussions. You can also call our Contact Centre on 014482225 (business hours are from 8am to 5pm, Mondays through Fridays).</p><br><br><p></p>`,
    closing: `<p></p>`,
  },
  {
    category: `Enquiry on Products-PSB`,
    opening: `<p>Our PSB (Public Sector Business) loan is designed for public sector employees who work with the Federal or State government. It is fast and does not require rigorous documentation. </p><br><br><p>Here are some of its features:</p><br><br><p>1.       Loan tenors range from 3 to 24 months (terms and conditions apply)</p><br><br><p>2.      Minimum loan amount is N18,000</p><br><br><p>3.       Insurance cover for all Personal/emergency loans (Life and hospitalization insurance)</p><br><br><p>To access this facility, we require:</p><br><br><p>1.       Your Completed Loan Agreement Form </p><br><br><p>2.      Letter of Introduction from employer</p><br><br><p>3.       3 months Bank Account statement & Pay slip</p><br><br><p>4.      Work Identity card </p><br><br><p>5.      I passport photograph</p><br><br><p>6.      A completed loan application form </p><br><br><p>7.       Bank Verification Number (BVN)</p><br><br><p>If you are interested in obtaining this facility, please respond to this email with your name, phone number and location, we will contact you for further discussions. You can also call our Contact Centre on 014482225 (business hours are from 8am to 5pm, Mondays through Fridays).</p><br><br><p></p>`,
    closing: `<p></p>`,
  },
  {
    category: `CDL/Konga Asset Financing`,
    opening: `<p>Credit Direct Limited, in partnership with Konga is financing state of the art assets purchase with our Asset finance loan. This implies that you can buy any product from Konga and pay later. </p><br><br><p>Here are some of the product features</p><br><br><p>1.       No collateral or guarantors required</p><br><br><p>2.      Tenors up to 12 months</p><br><br><p>3.       This product is open to both private and public sector employees</p><br><br><p>To access this facility, we require:</p><br><br><p>1.       Your Bank Verification Number </p><br><br><p>2.      Staff Identity card</p><br><br><p>3.       Active salary bank account</p><br><br><p>If you are interested in obtaining this facility, kindly respond to this email with your name, phone number and location, we will contact you for further discussions. Alternatively, you can call our Contact Centre on 014482225 (our business hours are from 8am to 5pm, Mondays through Fridays).</p><br><br><p></p><br><br><p></p>`,
    closing: `<p></p>`,
  },
];
