# TEMPLATE-SDF-Customization

Provide a meaningful summary of the business functions provided by the contents of the repository.

After cloning the repository you need to run "npm install" in the project directory to initialize the local tools.
---
Remove below the line ^^^

NOTE: Add pragma @NotNetSuite to any third party libraries to prevent @NApiVersion validation errors.


# Github Access / JIRA Access

Coordinate access to github with either **Serghino Felix serghino@erpsuccesspartners.com** or **Blaine Horrocks blaine@erpsuccesspartners.com**

# Github Account Setup

Github Setup for Mac: 
https://www.freecodecamp.org/news/setup-git-on-mac/

Github Setup for Windows: 
https://github.com/git-guides/install-git

1) Install Git for windows using the URL.
2) Setup git Config by setting Username and Email (Related URL: https://support.atlassian.com/bitbucket-cloud/docs/configure-your-dvcs-username-for-commits/)
3) Generate RSA Key on Windows using ssh-keygen (Related URL: https://phoenixnap.com/kb/generate-ssh-key-windows-10, https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
4) Copy the generated SHA 256 Public Key id_rsa.pub to your github settings keys and create an SSH Key. https://github.com/settings/keys
5) Happy git pull and commit

# VS Code Setup
 
VS Code Setup for Windows/ Mac: 
1) Download the Visual Studio Code installer for Windows.
2) Once it is downloaded, run the installer (VSCodeUserSetup-{version}.exe). (https://code.visualstudio.com/download)
3) Connect your Microsoft Account (365 Company Provided) to your VS Code after installation
 
# VS Code Extensions Setup - for SuiteCloud Developers/ NetSuite Developers

1) SuiteSnippets - enhances coding exprience for NS scripts lookup for used in NS Script Development
2) StandardJS - lints the script to the standard format. 
    Preferred Format: (semistandard - standard, with semicolons)


# Creating your SDF Project

Place the source files for your project under:

FileCabinet/SuiteScripts/ESP/COMPANYPREFIX_ProjectName

# Jira Project Management Tool 

1) Check if the Project exists in JIRA, if not, coordinate with your PM to create the Project for the specific client.
2) Create a new issue on the corresponding Project/ Board with the following sample format. (URL Actual reference: https://erpsp.atlassian.net/jira/software/projects/LEYE/boards/13?selectedIssue=LEYE-1)

For creation of tasks in the Project, follow the format:

**Implementation Team: **
Title: 'SD' + Solution Design Number + '_' + Project Name

**Support Team: **
Title: Case Number + '_' + Title Concern

