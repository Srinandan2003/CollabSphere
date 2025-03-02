import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card,CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bookmark, Filter, MessageSquare, Search, Share2, ThumbsUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // For navigation

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [likedItems, setLikedItems] = useState({}); 
  const navigate = useNavigate(); 
  const handleLike = (id) => {
    setLikedItems((prev) => ({
      ...prev,
      [id]: !prev[id], 
    }));
  };

  
  const handleDownload = (resourceUrl) => {
    window.open(resourceUrl, '_blank');
  };

 
  const handleJoinCommunity = (communityId) => {
    navigate(`/join-community/${communityId}`); 
  };

  return (
    <div className="flex flex-col gap-8 py-8">
      <section className="container space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Explore</h1>
          <p className="text-muted-foreground">
            Discover projects, resources, and communities that match your interests
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for projects, resources, or skills..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select defaultValue="newest">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="active">Most Active</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="communities">Communities</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  id: 1, // Unique ID for each item
                  title: "EcoTrack",
                  description: "Open-source platform for tracking environmental data with community contributions",
                  image: "https://images.unsplash.com/photo-1623119619997-14c1f94d0d0f?q=80&w=500&auto=format&fit=crop",
                  category: "Environment",
                  members: 24,
                  likes: 156,
                  type: "project"
                },
                {
                  id: 2,
                  title: "Web Developers Collective",
                  description: "A community of web developers sharing knowledge, resources, and collaboration opportunities",
                  image: "https://images.unsplash.com/photo-1573495612937-f978cc14e4b9?q=80&w=500&auto=format&fit=crop",
                  members: 3245,
                  type: "community"
                },
                {
                  id: 3,
                  title: "ArtCollective",
                  description: "Collaborative digital art gallery showcasing community creations",
                  image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=500&auto=format&fit=crop",
                  category: "Art & Design",
                  members: 47,
                  likes: 289,
                  type: "project"
                },
                {
                  id: 4,
                  title: "The Ultimate Guide to Remote Collaboration",
                  type: "resource",
                  resourceType: "Guide",
                  author: "Jamie Rivera",
                  downloads: 1243,
                  image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=500&auto=format&fit=crop",
                  resourceUrl: "https://example.com/guide.pdf" // Link to the resource
                },
                {
                  id: 5,
                  title: "Creative Innovators Hub",
                  description: "Where designers, artists, and creative thinkers come together to inspire and create",
                  image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=500&auto=format&fit=crop",
                  members: 2187,
                  type: "community"
                },
                {
                  id: 6,
                  title: "CodeMentor",
                  description: "Peer mentorship platform connecting coding learners with experienced developers",
                  image: "https://images.unsplash.com/photo-1522252234503-e356532cafd5?q=80&w=500&auto=format&fit=crop",
                  category: "Education",
                  members: 36,
                  likes: 210,
                  type: "project"
                }
              ].map((item) => {
                const isLiked = likedItems[item.id] || false; // Check if the item is liked

                if (item.type === "project") {
                  return (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="aspect-video w-full overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="h-full w-full object-cover transition-all hover:scale-105"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{item.category}</Badge>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="mr-1 h-4 w-4" />
                            {item.members}
                          </div>
                        </div>
                        <CardTitle>{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="flex justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(item.id)} // Toggle like state
                        >
                          <ThumbsUp className={`mr-2 h-4 w-4 ${isLiked ? 'text-blue-500' : ''}`} />
                          {isLiked ? item.likes + 1 : item.likes} {/* Update like count */}
                        </Button>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  );
                } else if (item.type === "community") {
                  return (
                    <Card key={item.id} className="flex flex-col">
                      <div className="aspect-video w-full overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="h-full w-full object-cover transition-all hover:scale-105"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">Community</Badge>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="mr-1 h-4 w-4" />
                            {item.members.toLocaleString()}
                          </div>
                        </div>
                        <CardTitle>{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="mt-auto">
                        <Button
                          className="w-full"
                          onClick={() => handleJoinCommunity(item.id)} // Navigate to Join Community page
                        >
                          Join Community
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                } else if (item.type === "resource") {
                  return (
                    <Card key={item.id} className="flex flex-col overflow-hidden">
                      <div className="aspect-video w-full overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="h-full w-full object-cover transition-all hover:scale-105"
                        />
                      </div>
                      <CardHeader>
                        <Badge className="w-fit" variant="outline">{item.resourceType}</Badge>
                        <CardTitle>{item.title}</CardTitle>
                        <CardDescription>By {item.author}</CardDescription>
                      </CardHeader>
                      <CardFooter className="mt-auto">
                        <div className="flex w-full items-center justify-between">
                          <span className="text-sm text-muted-foreground">{item.downloads} downloads</span>
                          <Button
                            size="sm"
                            onClick={() => handleDownload(item.resourceUrl)} // Handle download
                          >
                            Download
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  );
                }
                return null;
              })}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default Explore;
