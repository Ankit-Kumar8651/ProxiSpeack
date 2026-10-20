# ProxiSpeak — Geospatial Proximity Audio Ecosystem

**A proximity-based virtual office where conversations happen naturally as people move closer to one another.**

ProxiSpeak is a virtual collaboration platform designed to recreate the feeling of working together in a physical office. Instead of joining fixed video calls, users interact through avatars on a shared virtual workspace, where proximity determines who can hear whom.

The project explores geospatial positioning, real-time communication, and spatial audio to create a more natural and immersive remote collaboration experience.

## ✨ Features

- **Interactive Virtual Office** — Explore a 2D workspace with movable user avatars.
- **Proximity-Based Communication** — Enable conversations based on the distance between participants.
- **Real-Time Interaction** — Designed for live collaboration using real-time communication technologies.
- **Spatial Audio** — Audio volume and audibility can adapt to the distance between users.
- **User Authentication** — Sign-up and login functionality for controlled access to the workspace.
- **People Management** — Add, edit, and organize people in the virtual office.
- **Responsive Interface** — Designed to work across desktop and mobile devices.
- **Theme Customization** — Switch between available visual themes.

## 🎯 Project Objective

Traditional video conferencing tools often require users to join scheduled meetings or separate calls. ProxiSpeak aims to make remote collaboration more spontaneous by allowing users to approach others, start conversations, and move between groups naturally.

The goal is to build a virtual environment that makes distributed teams feel more connected.

## 🛠️ Technology Stack

The following technologies are planned or used in the project, depending on the current implementation.

| Technology | Purpose |
|---|---|
| React | Interactive user interface |
| JavaScript | Application logic and interactions |
| HTML5 & CSS3 | Structure, styling, and responsive layouts |
| Node.js | Backend services |
| Socket.IO | Real-time events and signaling |
| WebRTC | Peer-to-peer audio communication |
| MongoDB | User data and spatial information |
| Git & GitHub | Version control and collaboration |

## 🏗️ System Architecture

ProxiSpeak is designed around four main components:

1. **Frontend Workspace** — Renders the virtual office, avatars, and user interactions.
2. **Geospatial Engine** — Calculates distances between users and identifies nearby participants.
3. **Real-Time Signaling** — Coordinates communication sessions and WebRTC connection setup.
4. **Spatial Audio Engine** — Adjusts audio audibility according to proximity.

These components work together to support a virtual office experience where movement influences communication.

## 🚀 Getting Started

### Prerequisites

Install the following before running the project:

- Node.js and npm
- Git
- MongoDB, if required by the backend configuration

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Ankit-Kumar8651/ProxiSpeack.git
```

**2. Navigate to the project directory**

```bash
cd ProxiSpeack
```

**3. Install dependencies**

If the root directory contains a `package.json` file:

```bash
npm install
```

If the frontend and backend have separate directories, install dependencies in each directory containing its own `package.json`.

**4. Configure environment variables**

Create a `.env` file where required by the application and add the necessary configuration, such as database connection details and server ports.

Never commit secrets, passwords, or API keys to GitHub.

**5. Start the application**

Check the scripts in your `package.json` files and use the appropriate command. For a typical Vite frontend, this may be:

```bash
npm run dev
```

For a backend with a configured start script, use the appropriate command from its directory.

## 💡 How It Works

1. A user signs up and logs in.
2. The user enters the virtual office.
3. Avatars represent participants in the shared workspace.
4. Users move around the workspace to approach or leave conversations.
5. The application calculates proximity between participants.
6. The communication system uses proximity information to determine audio connections and audibility.

*The actual behavior depends on the features implemented and integrated in the current version.*

## 🔮 Future Enhancements

- Support for larger concurrent user groups.
- Improved spatial audio and smooth volume transitions.
- Private meeting areas and customizable virtual rooms.
- User presence and availability indicators.
- Enhanced performance and network optimization.
- Deployment for remote teams and distributed organizations.

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make and test your changes.
4. Commit your changes with a descriptive message.
5. Open a pull request.

## 👥 Project Team

Developed collaboratively as part of a remote internship project with **Infotact Solutions**.

## 📄 License

No license has been specified yet. Add a license file if you intend to permit reuse or redistribution of the project.

---

**ProxiSpeak — Bringing people closer through proximity-based communication.**
