function TeamWorkspace({ onSelectPrompt }) {
  try {
    const [workspaces, setWorkspaces] = React.useState([]);
    const [activeWorkspace, setActiveWorkspace] = React.useState(null);
    const [teamMembers, setTeamMembers] = React.useState([]);
    const [sharedPrompts, setSharedPrompts] = React.useState([]);
    const [isCreatingWorkspace, setIsCreatingWorkspace] = React.useState(false);
    const [newWorkspaceName, setNewWorkspaceName] = React.useState('');

    React.useEffect(() => {
      loadWorkspaces();
    }, []);

    const loadWorkspaces = async () => {
      try {
        if (typeof trickleListObjects !== 'undefined') {
          const result = await trickleListObjects('team_workspace', 20, true, undefined);
          setWorkspaces(result.items || []);
        } else {
          // Fallback to mock data when database is not available
          setWorkspaces([
            {
              objectId: 'mock_workspace_1',
              objectData: {
                Name: 'Creative Team',
                CreatedBy: 'demo_user',
                Members: JSON.stringify(['user1', 'user2']),
                SharedPrompts: JSON.stringify([]),
                Settings: JSON.stringify({ permissions: 'edit' })
              },
              createdAt: new Date().toISOString()
            }
          ]);
        }
      } catch (error) {
        console.error('Error loading workspaces:', error);
        // Fallback to empty array on error
        setWorkspaces([]);
      }
    };

    const createWorkspace = async () => {
      if (!newWorkspaceName.trim()) return;
      
      try {
        const workspaceData = {
          Name: newWorkspaceName,
          CreatedBy: 'current_user',
          Members: JSON.stringify([]),
          SharedPrompts: JSON.stringify([]),
          Settings: JSON.stringify({ permissions: 'edit' })
        };
        
        if (typeof trickleCreateObject !== 'undefined') {
          await trickleCreateObject('team_workspace', workspaceData);
        } else {
          // Fallback to local storage when database is not available
          const localWorkspaces = JSON.parse(localStorage.getItem('teamWorkspaces') || '[]');
          const newWorkspace = {
            objectId: 'local_' + Date.now(),
            objectData: workspaceData,
            createdAt: new Date().toISOString()
          };
          localWorkspaces.push(newWorkspace);
          localStorage.setItem('teamWorkspaces', JSON.stringify(localWorkspaces));
        }
        
        setNewWorkspaceName('');
        setIsCreatingWorkspace(false);
        await loadWorkspaces();
        alert('Workspace berhasil dibuat!');
      } catch (error) {
        console.error('Error creating workspace:', error);
        alert('Gagal membuat workspace');
      }
    };

    const joinWorkspace = async (workspaceId) => {
      setActiveWorkspace(workspaceId);
      // Load shared prompts for this workspace
      try {
        if (typeof trickleListObjects !== 'undefined') {
          const result = await trickleListObjects(`shared_prompt:${workspaceId}`, 50, true, undefined);
          setSharedPrompts(result.items || []);
        } else {
          // Fallback to mock shared prompts
          setSharedPrompts([
            {
              objectId: 'mock_prompt_1',
              objectData: {
                Title: 'Cinematic Product Demo',
                Content: 'Professional cinematic video showcasing product features with dramatic lighting and smooth camera movements.',
                Author: 'team_member_1',
                WorkspaceId: workspaceId
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ]);
        }
      } catch (error) {
        console.error('Error loading shared prompts:', error);
        setSharedPrompts([]);
      }
    };

    return (
      <div className="space-y-6" data-name="team-workspace" data-file="components/TeamWorkspace.js">
        <div className="card-glass">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <div className="icon-users-2 text-2xl mr-3"></div>
            Team Collaboration Workspace
          </h2>
          
          {!activeWorkspace ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-semibold">Your Workspaces</h3>
                <button
                  onClick={() => setIsCreatingWorkspace(true)}
                  className="btn-primary px-4 py-2"
                >
                  <div className="icon-plus text-lg mr-2"></div>
                  Create Workspace
                </button>
              </div>

              {isCreatingWorkspace && (
                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={newWorkspaceName}
                      onChange={(e) => setNewWorkspaceName(e.target.value)}
                      placeholder="Workspace name..."
                      className="input-modern flex-1"
                    />
                    <button onClick={createWorkspace} className="btn-primary px-4 py-2">
                      Create
                    </button>
                    <button
                      onClick={() => setIsCreatingWorkspace(false)}
                      className="px-4 py-2 bg-white/10 rounded-lg text-white/70"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workspaces.map(workspace => (
                  <div key={workspace.objectId} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h4 className="text-white font-medium mb-2">{workspace.objectData.Name}</h4>
                    <p className="text-white/60 text-sm mb-3">Created by {workspace.objectData.CreatedBy}</p>
                    <button
                      onClick={() => joinWorkspace(workspace.objectId)}
                      className="btn-primary w-full"
                    >
                      Join Workspace
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-semibold">Shared Prompts</h3>
                <button
                  onClick={() => setActiveWorkspace(null)}
                  className="text-white/70 hover:text-white"
                >
                  <div className="icon-arrow-left text-lg mr-2"></div>
                  Back to Workspaces
                </button>
              </div>

              <div className="grid gap-4">
                {sharedPrompts.map(prompt => (
                  <div key={prompt.objectId} className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-medium">{prompt.objectData.Title}</h4>
                      <span className="text-white/50 text-xs">{prompt.objectData.Author}</span>
                    </div>
                    <p className="text-white/70 text-sm mb-3">{prompt.objectData.Content.substring(0, 100)}...</p>
                    <div className="flex justify-between items-center">
                      <span className="text-white/50 text-xs">
                        Last edited: {new Date(prompt.updatedAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => onSelectPrompt(prompt.objectData.Content)}
                        className="btn-primary px-3 py-1 text-sm"
                      >
                        Use Prompt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('TeamWorkspace component error:', error);
    return null;
  }
}