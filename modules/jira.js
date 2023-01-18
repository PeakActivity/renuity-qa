
const {JiraApi} = require('jira-client');
const token = process.env.jira_token;

function jiraClient (){
    const jira = new JiraApi({
        protocol: 'https',
        host: 'peakactivity.atlassian.net',
        username: 'pzhukov@peakactivity.com',
        password: token,
        apiVersion: '2',
        strictSSL: true
    });
    console.log({token})

    async function addComment(ticket_id, comment){
        console.log(ticket_id);
        console.log(comment);

        try {
            const issue = await jira.findIssue(ticket_id);
            console.log(`Status: ${issue.fields.status.name}`);
        } catch (err) {
            console.error(err);
        }
    }

    return {addComment}
}





module.exports = jiraClient()
