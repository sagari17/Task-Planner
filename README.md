# Task-Planner
This project contains the code for the Task-Planner. The application is a tool that let the end user write and edit tasks in a structed fashion.

## Dependencies

### Git
We use the Git Version Control System to collaborate. We use the *Git Bash Terminal* as the environment to run git commands. Download here: https://git-scm.com/download/win

#### Configuring Git
Open Git Bash and run the following commands:

```$ git config --global user.name "<full name>"```

```$ git config --global user.email "<UiA e-mail address>" ```

Example:

```$ git config --global user.name "Sagar Iqbal"```

```$ git config --global user.email "sagari17@uia.no" ```

#### Create and add SSH Key
The git repository is private and requires SSH keys to access it.

Create SSH Key:  ```$ ssh-keygen```

Keep pressing enter to accept the default settings.

Copy the SSH Key: ```$ cat ~/.ssh/id_rsa.pub```

Add the key to your Github profile, by *clicking on your profile icon* in the top right corner, press *settings*, click *SSH and GPG Keys*, click *New SSH Key*, type laptop name in title, ex: "school laptop" and press ctrl-v to paste the SSH key.

#### Clone the project
Change to a directory where you wish the project to be stored. Then clone the project repository by copying this command to the git bash terminal windows:
```$ git clone git@github.com:sagari17/Task-Planner.git ```

### Node
Node is the environment where our application will run. Download the LTS (Long Term Support) Version. Go to [nodejs.org](https://nodejs.org/en/) to download.

### Nodemon
Nodemon automatically monitors any changes to the application and updates the localhost server.
We use the *Node Package Manager (npm)* to install it:
```npm install -g nodemon```

### Heroku
Our application will run on an Heroku server.
To begin, go to 'Download and install' here: https://devcenter.heroku.com/articles/heroku-cli

## Run local application
We use *node.js* to run the application locally on the computer. In the project root directory run the following command: ```nodemon main.js```

In Firefox go to: `localhost:8080` to interact with the application.

## Upload application to Heroku
Go to the root project directory. And type: ```$ heroku login``` Follow the direction and log in to Heroku.

After you have logged in, terminate the batch job by pressing: ```ctrl-c``` and terminate.

Type: ```$ heroku create```

Finally, type ```$ git push heroku master```

The application is now pushed to the Heroku web server.

Go to https://uia-task-planner.herokuapp.com/ to interact.

## Application information

## package.json
The *package.json* is the manifest file that tells node.js the basic configuration of our application.

## Requirements
* The **Task-Planner** is a web app and will have an accompanying server that is used as a task planner tool. 
* The team will use the Scrum agile development process. Including feature map and project board.
* Version control system is Git and Github. Including branching & pull request.
* Clean and effective code.

### Functional Requirements
* Scheduling
* Notification
* Grouping
* Filtering
* Tagging

### Technical Requirements
* Data is to be stored in a Postgres database.
* Documented REST API for communication between client and server.
* All communication between client and server must be executed _only_ in the REST API.
* JSON as data transport format.
* Responsive HTML5 client.
* The application must run on [Heroku](https://dashboard.heroku.com/apps)
* The application must work in FireFox.

### API Requirements
* [ ] Server API for Create / Delete / Update Lists
* [ ] Server API for Create / Delete / Update Lists items
* [ ] Server API for Create / Delete / Update / Authenticate user accounts
* [ ] Server API for share / unshare Lists (private/public) 

### Client Requirements

#### Minimum
* [ ] Client that can create / authenticate / delete users
* [ ] Client that can create / update / delete lists
* [ ] Client that can create / update / delete list items
* [ ] Client that can facilitate sharing / unshare lists
* [ ] Client/server must require authentication when appropriate

### Additional Requirements (if time)
* [ ] Share lists private/individual/public
* [ ] Collect and report user metrics to the user 
* [ ] Deadlines for individual list items, with an appropriate feedback system
* [ ] Tagging of list items 
* [ ] Filtering of lists using tags.
* [ ] Filtered view of tasks (for instance show me all tasks due today)
* [ ] Assigning user to a task.
* [ ] Server code is modularly structured in an intuitive way.
* [ ] Client code is modularly structured in an intuitive way.

Alternatively (for A grade),
* [ ] Push notifications on task assignments, deadlines etc.
* [ ] Email optional task digests to user. (task links in email should go directly to app task)
* [ ] PWA Client(must be done in a meaningful way)
* [ ] Use google analytics to trac usage patterns.
* [ ] Application admin digest of errors.