# Task-Planner
This project contains the code for the Task-Planner. The application is a tool that let the end user write and edit tasks in a structed fashion.

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
* The application must run on Heroku.
* The application must work in FireFox.

### API Requirements
* [ ] Server API for Create / Delete / Update Lists
* [ ] Server API for Create / Delete / Update Lists items
* [ ] Server API for Create / Delete / Update / Authenticate user accounts
* [ ] Server API for share / unshare Lists (private/public) 

### Client Requirements

#### Minimum
* [x] Client that can create / authenticate / delete users
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