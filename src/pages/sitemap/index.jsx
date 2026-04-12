import React, { startTransition, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import EmergencyAlertIndicator from '../../components/ui/EmergencyAlertIndicator';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useAppData } from '../../contexts/AppDataContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  collectNodeIds,
  filterSiteStructure,
  findTrailByPath,
  flattenSiteStructure,
  siteStructure
} from '../../data/siteStructure';

const getBreadcrumbLabel = (trail) => trail.map((node) => node.title).join(' / ');

const TreeNode = ({
  node,
  depth,
  expandedNodes,
  onToggle,
  onNavigate,
  activePath,
  hoveredNodeId,
  onHoverNode
}) => {
  const hasChildren = Boolean(node.children?.length);
  const isExpanded = expandedNodes.has(node.id);
  const isActive = node.path === activePath;
  const isHovered = hoveredNodeId === node.id;

  return (
    <div className="relative">
      {depth > 0 && (
        <div className="absolute left-[1.15rem] top-0 h-full w-px bg-border/70" aria-hidden="true" />
      )}

      <div className="relative pl-0">
        <div
          className={`
            group relative flex items-center gap-3 rounded-2xl border p-3 transition-all duration-300 ease-out
            ${isActive
              ? 'border-primary bg-primary/10 shadow-soft ring-1 ring-primary/20'
              : 'border-border bg-card hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elevated'
            }
            ${isHovered ? 'scale-[1.01]' : ''}
          `}
          style={{ marginLeft: `${depth * 18}px` }}
          onMouseEnter={() => onHoverNode(node)}
          onFocus={() => onHoverNode(node)}
        >
          {depth > 0 && (
            <div className="absolute left-0 top-1/2 h-px w-4 -translate-x-2 bg-border/70" aria-hidden="true" />
          )}

          {hasChildren ? (
            <button
              type="button"
              onClick={() => onToggle(node.id)}
              className={`
                flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border transition-all duration-300
                ${isExpanded ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-muted-foreground hover:border-primary hover:text-primary'}
              `}
              aria-label={isExpanded ? `Collapse ${node.title}` : `Expand ${node.title}`}
              aria-expanded={isExpanded}
            >
              <Icon
                name="ChevronRight"
                size={16}
                className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}
              />
            </button>
          ) : (
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Icon name="Dot" size={16} />
            </div>
          )}

          <button
            type="button"
            onClick={() => onNavigate(node.path)}
            disabled={!node.path}
            className={`
              relative flex min-w-0 flex-1 items-center gap-3 rounded-xl px-1 py-1 text-left transition-all duration-300
              ${node.path ? 'cursor-pointer' : 'cursor-default'}
            `}
          >
            <div className={`
              flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-300
              ${isActive ? 'bg-primary text-primary-foreground shadow-soft' : 'bg-primary/10 text-primary group-hover:scale-105 group-hover:shadow-soft'}
            `}>
              <Icon name={node.icon || 'FileText'} size={20} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`font-semibold ${isActive ? 'text-primary' : 'text-card-foreground group-hover:text-primary'}`}>
                  {node.title}
                </span>
                {isActive && (
                  <span className="inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
                    Current page
                  </span>
                )}
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{node.description}</p>
              <div className="mt-2 text-xs text-muted-foreground">{node.path || 'Section group'}</div>
            </div>

            {node.path && (
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-background text-muted-foreground transition-all duration-300 group-hover:bg-primary/10 group-hover:text-primary">
                <Icon name="ArrowUpRight" size={16} />
              </div>
            )}
          </button>
        </div>

        <div
          className={`
            overflow-hidden transition-all duration-300 ease-out
            ${hasChildren && isExpanded ? 'max-h-[120rem] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-1'}
          `}
        >
          <div className="space-y-3 pt-3">
            {hasChildren && isExpanded && node.children.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                depth={depth + 1}
                expandedNodes={expandedNodes}
                onToggle={onToggle}
                onNavigate={onNavigate}
                activePath={activePath}
                hoveredNodeId={hoveredNodeId}
                onHoverNode={onHoverNode}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SitemapPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { alerts, profile } = useAppData();
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredNode, setHoveredNode] = useState(null);
  const deferredSearchTerm = useDeferredValue(searchTerm.trim());

  const activeAlertCount = alerts.filter((alert) => !(alert?.acknowledgedBy || []).includes(user?.uid)).length;
  const latestAlert = alerts[0]
    ? {
        title: alerts[0].title,
        preview: `${alerts[0].description.substring(0, 100)}...`,
        time: new Date(alerts[0].timestamp).toLocaleTimeString('en-IN')
      }
    : null;

  const activeTrail = useMemo(() => findTrailByPath(siteStructure, location.pathname), [location.pathname]);
  const filteredTree = useMemo(
    () => filterSiteStructure(siteStructure, deferredSearchTerm),
    [deferredSearchTerm]
  );
  const flattenedFilteredNodes = useMemo(() => flattenSiteStructure(filteredTree), [filteredTree]);
  const totalPageCount = useMemo(
    () => flattenSiteStructure(siteStructure).filter((node) => Boolean(node.path)).length,
    []
  );

  const [expandedNodes, setExpandedNodes] = useState(() => new Set(activeTrail.map((node) => node.id)));

  useEffect(() => {
    if (activeTrail.length === 0) {
      return;
    }

    setExpandedNodes((previous) => new Set([...previous, ...activeTrail.map((node) => node.id)]));
  }, [activeTrail]);

  useEffect(() => {
    if (!deferredSearchTerm) {
      return;
    }

    setExpandedNodes((previous) => new Set([...previous, ...collectNodeIds(filteredTree)]));
  }, [deferredSearchTerm, filteredTree]);

  useEffect(() => {
    if (!hoveredNode && activeTrail.length > 0) {
      setHoveredNode(activeTrail[activeTrail.length - 1]);
    }
  }, [hoveredNode, activeTrail]);

  const handleToggle = (nodeId) => {
    startTransition(() => {
      setExpandedNodes((previous) => {
        const next = new Set(previous);

        if (next.has(nodeId)) {
          next.delete(nodeId);
        } else {
          next.add(nodeId);
        }

        return next;
      });
    });
  };

  const handleExpandAll = () => {
    startTransition(() => {
      setExpandedNodes(new Set(collectNodeIds(filteredTree)));
    });
  };

  const handleCollapseToActive = () => {
    startTransition(() => {
      setExpandedNodes(new Set(activeTrail.map((node) => node.id)));
    });
  };

  const hoverTrail = hoveredNode?.path ? findTrailByPath(siteStructure, hoveredNode.path) : hoveredNode?.breadcrumbTrail || [];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Sitemap - Disaster Preparedness and Response Education System</title>
        <meta name="description" content="Interactive visualization of the website structure." />
      </Helmet>

      <Header userRole={profile?.role || 'public'} alertCount={activeAlertCount} onMenuToggle={() => {}} />

      <EmergencyAlertIndicator
        alertCount={activeAlertCount}
        alertLevel={activeAlertCount > 0 ? 'medium' : 'low'}
        latestAlert={latestAlert}
      />

      <main className="container mx-auto px-4 py-8">
        <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-slate-950 via-slate-900 to-primary p-6 text-white shadow-elevated md:p-8">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -left-8 top-8 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
            <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                <Icon name="GitBranch" size={16} />
                Interactive Sitemap
              </div>
              <h1 className="text-3xl font-bold md:text-4xl">Explore the full application structure</h1>
              <p className="mt-3 text-sm text-white/80 md:text-base">
                Browse the site as a living tree, expand branches, search pages, preview breadcrumbs, and jump directly
                to any section from one interactive map.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">{totalPageCount}</div>
                <div className="text-xs text-white/70">Routable pages</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">{flattenedFilteredNodes.length}</div>
                <div className="text-xs text-white/70">Visible nodes</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm col-span-2 sm:col-span-1">
                <div className="text-2xl font-bold">{activeTrail.length}</div>
                <div className="text-xs text-white/70">Active trail depth</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.7fr)_360px]">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-soft md:p-6">
            <div className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-card-foreground">Tree View</h2>
                <p className="text-sm text-muted-foreground">
                  Expand sections, hover for context, and click any node to navigate.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative min-w-[240px]">
                  <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="sitemap-search"
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search pages, routes, topics..."
                    className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleExpandAll} iconName="PlusSquare" iconPosition="left">
                    Expand all
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCollapseToActive} iconName="Minimize2" iconPosition="left">
                    Focus active
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {filteredTree.length > 0 ? (
                filteredTree.map((node) => (
                  <TreeNode
                    key={node.id}
                    node={node}
                    depth={0}
                    expandedNodes={expandedNodes}
                    onToggle={handleToggle}
                    onNavigate={(path) => path && navigate(path)}
                    activePath={location.pathname}
                    hoveredNodeId={hoveredNode?.id}
                    onHoverNode={setHoveredNode}
                  />
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-10 text-center">
                  <Icon name="SearchX" size={42} className="mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold text-foreground">No matching pages found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try a broader keyword such as "alerts", "flood", "assessment", or "games".
                  </p>
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center gap-2">
                <Icon name="PanelRight" size={18} className="text-primary" />
                <h2 className="text-lg font-semibold text-card-foreground">Node Preview</h2>
              </div>

              {hoveredNode ? (
                <div className="mt-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-soft">
                      <Icon name={hoveredNode.icon || 'FileText'} size={22} />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-card-foreground">{hoveredNode.title}</div>
                      <div className="text-sm text-muted-foreground">{hoveredNode.path || 'Section group'}</div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-background p-4">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Breadcrumb preview
                    </div>
                    <div className="text-sm leading-6 text-foreground">
                      {hoverTrail.length > 0 ? getBreadcrumbLabel(hoverTrail) : hoveredNode.title}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-background p-4 text-sm text-muted-foreground">
                    {hoveredNode.description}
                  </div>

                  {hoveredNode.path && (
                    <Button fullWidth onClick={() => navigate(hoveredNode.path)} iconName="ArrowRight" iconPosition="right">
                      Open page
                    </Button>
                  )}
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">
                  Hover over a node to preview its breadcrumb trail and route details.
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center gap-2">
                <Icon name="Sparkles" size={18} className="text-primary" />
                <h2 className="text-lg font-semibold text-card-foreground">How it works</h2>
              </div>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <p>The sitemap reads from shared application structure data rather than a hand-written list.</p>
                <p>Collapsed branches render progressively, which keeps the interface lighter as the tree grows.</p>
                <p>The active route auto-expands, and search opens matching branches so navigation stays fast.</p>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
};

export default SitemapPage;
