import { useState } from 'react';
import { Zap, Key, Brain, Lock } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useDreamStore } from '../store/dreamStore';
import { PasswordSettings } from './auth/PasswordSettings';
import type { AIProvider } from '../types';

export function ConfigurationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { aiConfig, updateAIConfig, setAIProvider } = useDreamStore();
  
  const [enabled, setEnabled] = useState(aiConfig.enabled);
  const [provider, setProvider] = useState<AIProvider>(aiConfig.provider);
  const [apiKey, setApiKey] = useState(aiConfig.apiKey);
  const [completionEndpoint, setCompletionEndpoint] = useState(aiConfig.completionEndpoint || 'http://localhost:1234/v1/chat/completions');
  const [modelName, setModelName] = useState(aiConfig.modelName);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'password'>('ai');

  const handleSave = async () => {
    setIsSaving(true);
    try {
      updateAIConfig({
        enabled,
        provider,
        apiKey,
        completionEndpoint,
        modelName,
      });
      onClose();
    } catch (error) {
      console.error('Error saving AI configuration:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleProviderChange = (newProvider: AIProvider) => {
    // Save current configuration before switching
    updateAIConfig({
      enabled,
      provider,
      apiKey,
      completionEndpoint,
      modelName,
    });
    
    // Switch to new provider
    setProvider(newProvider);
    setAIProvider(newProvider);
    
    // Update form fields with the new provider's config
    const newConfig = useDreamStore.getState().aiConfig;
    setEnabled(newConfig.enabled);
    setApiKey(newConfig.apiKey);
    setCompletionEndpoint(newConfig.completionEndpoint || 'http://localhost:1234/v1/chat/completions');
    setModelName(newConfig.modelName);
  };

  const handleCancel = () => {
    // Reset form to current values
    setEnabled(aiConfig.enabled);
    setProvider(aiConfig.provider);
    setApiKey(aiConfig.apiKey);
    setCompletionEndpoint(aiConfig.completionEndpoint || 'http://localhost:1234/v1/chat/completions');
    setModelName(aiConfig.modelName);
    onClose();
  };

  const getProviderInstructions = (provider: AIProvider) => {
    switch (provider) {
             case 'gemini':
         return {
           title: 'Google Gemini',
           description: 'Use Google\'s Gemini AI for automatic tag generation',
           instructions: [
             '1. Visit Google AI Studio (https://aistudio.google.com/)',
             '2. Sign in and click "Get API Key"',
             '3. Copy your API key and paste it below',
             '4. Enter your preferred model name (e.g., gemini-2.0-flash)'
           ]
         };
             case 'lmstudio':
         return {
           title: 'LM Studio',
           description: 'Use local models through LM Studio for privacy',
           instructions: [
             '1. Download and install LM Studio',
             '2. Load your preferred model',
             '3. Start the local server (usually runs on localhost:1234)',
             '4. Enter the completion endpoint URL',
             '5. Enter your model name as configured in LM Studio'
           ]
         };
      default:
        return { title: '', description: '', instructions: [] };
    }
  };

  const providerInfo = getProviderInstructions(provider);

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title="Configurations" className="max-w-lg">
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 p-1 glass rounded-lg border border-white/20">
        <button
          onClick={() => setActiveTab('ai')}
          className={`
            flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 relative overflow-hidden group
            ${activeTab === 'ai' 
              ? 'glass text-white/90 font-medium shadow-inner-lg border border-white/20' 
              : 'text-white/60 hover:glass hover:text-white/90 hover:font-medium hover:shadow-inner-lg hover:border-white/20'
            }
          `}
        >
          <div className="absolute inset-0 bg-gradient-shimmer bg-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex items-center justify-center gap-2 relative z-10">
            <Brain className="w-4 h-4" />
            AI Features
          </div>
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`
            flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 relative overflow-hidden group
            ${activeTab === 'password' 
              ? 'glass text-white/90 font-medium shadow-inner-lg border border-white/20' 
              : 'text-white/60 hover:glass hover:text-white/90 hover:font-medium hover:shadow-inner-lg hover:border-white/20'
            }
          `}
        >
          <div className="absolute inset-0 bg-gradient-shimmer bg-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex items-center justify-center gap-2 relative z-10">
            <Lock className="w-4 h-4" />
            Lockscreen
          </div>
        </button>
      </div>

      {activeTab === 'ai' ? (
        <div className="space-y-6">
          {/* AI Features Toggle */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl glass flex items-center justify-center border border-white/20">
                <Zap className="w-5 h-5 text-white/90" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white/90">AI Features</h3>
                <p className="text-sm text-white/60">Enable AI Features (category suggestion for now...)</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 glass rounded-xl border border-white/20">
              <span className="text-white/90">Enable AI Features</span>
              <button
                onClick={() => setEnabled(!enabled)}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
                  ${enabled ? 'bg-white/20 border border-white/30' : 'bg-white/10 border border-white/20'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200
                    ${enabled ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>
          </div>

          {enabled && (
            <>
                          {/* Provider Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl glass flex items-center justify-center border border-white/20">
                  <Brain className="w-5 h-5 text-white/90" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white/90">AI Provider</h3>
                  <p className="text-sm text-white/60">Choose your AI service</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleProviderChange('gemini')}
                  className={`
                    p-4 rounded-xl border transition-all duration-200 text-left relative overflow-hidden group
                    ${provider === 'gemini' 
                      ? 'glass text-white/90 font-medium shadow-inner-lg border border-white/20' 
                      : 'border-white/20 text-white/60 hover:glass hover:text-white/90 hover:font-medium hover:shadow-inner-lg hover:border-white/20'
                    }
                  `}
                >
                  <div className="absolute inset-0 bg-gradient-shimmer bg-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="font-medium mb-1">Gemini</div>
                    <div className="text-xs text-white/50">Google's cloud-based AI</div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleProviderChange('lmstudio')}
                  className={`
                    p-4 rounded-xl border transition-all duration-200 text-left relative overflow-hidden group
                    ${provider === 'lmstudio' 
                      ? 'glass text-white/90 font-medium shadow-inner-lg border border-white/20' 
                      : 'border-white/20 text-white/60 hover:glass hover:text-white/90 hover:font-medium hover:shadow-inner-lg hover:border-white/20'
                    }
                  `}
                >
                  <div className="absolute inset-0 bg-gradient-shimmer bg-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="font-medium mb-1">LM Studio</div>
                    <div className="text-xs text-white/50">Local AI models</div>
                  </div>
                </button>
              </div>
            </div>

              {/* Provider Instructions */}
              <div className="p-4 glass rounded-xl border border-white/20">
                <h4 className="font-semibold text-white/90 mb-2">{providerInfo.title}</h4>
                <p className="text-sm text-white/60 mb-3">{providerInfo.description}</p>
                <div className="space-y-1">
                  {providerInfo.instructions.map((instruction, index) => (
                    <p key={index} className="text-xs text-white/50">{instruction}</p>
                  ))}
                </div>
              </div>

              {/* API Configuration */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl glass flex items-center justify-center border border-white/20">
                    <Key className="w-5 h-5 text-white/90" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white/90">API Configuration</h3>
                    <p className="text-sm text-white/60">Set up your API credentials</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {provider === 'gemini' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">
                          API Key
                        </label>
                                               <Input
                         type="password"
                         value={apiKey}
                         onChange={(e) => setApiKey(e.target.value)}
                         placeholder="Enter your Gemini API key"
                         variant="transparent"
                         className="w-full hover:border-white/50 focus:border-white/70 focus:ring-2 focus:ring-white/20 transition-all duration-200"
                       />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">
                          Model Name
                        </label>
                                               <Input
                         type="text"
                         value={modelName}
                         onChange={(e) => setModelName(e.target.value)}
                         placeholder="e.g., gemini-2.0-flash"
                         variant="transparent"
                         className="w-full hover:border-white/50 focus:border-white/70 focus:ring-2 focus:ring-white/20 transition-all duration-200"
                       />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">
                          Completion Endpoint
                        </label>
                                               <Input
                         type="text"
                         value={completionEndpoint}
                         onChange={(e) => setCompletionEndpoint(e.target.value)}
                         placeholder="e.g., http://localhost:1234/v1/chat/completions"
                         variant="transparent"
                         className="w-full hover:border-white/50 focus:border-white/70 focus:ring-2 focus:ring-white/20 transition-all duration-200"
                       />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">
                          Model Name
                        </label>
                                               <Input
                         type="text"
                         value={modelName}
                         onChange={(e) => setModelName(e.target.value)}
                         placeholder="e.g., local-model"
                         variant="transparent"
                         className="w-full hover:border-white/50 focus:border-white/70 focus:ring-2 focus:ring-white/20 transition-all duration-200"
                       />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="flex-1 text-white/60 hover:glass hover:text-white/90 hover:font-medium hover:shadow-inner-lg hover:border-white/20 relative overflow-hidden group cursor-pointer transition-all duration-300"
            >
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 bg-gradient-shimmer bg-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">Cancel</span>
            </Button>
                      <Button
            variant="ghost"
            onClick={handleSave}
            disabled={isSaving || (enabled && (
              (provider === 'gemini' && (!apiKey || !modelName)) ||
              (provider === 'lmstudio' && (!completionEndpoint || !modelName))
            ))}
            className="flex-1 glass text-white/90 font-medium shadow-inner-lg border border-white/20 hover:glass-hover hover:text-white hover:border-white/30 relative overflow-hidden group cursor-pointer transition-all duration-300"
          >
            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 bg-gradient-shimmer bg-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10">{isSaving ? 'Saving...' : 'Save Configuration'}</span>
          </Button>
          </div>
        </div>
      ) : (
        <PasswordSettings onClose={onClose} />
      )}
    </Modal>
  );
}
